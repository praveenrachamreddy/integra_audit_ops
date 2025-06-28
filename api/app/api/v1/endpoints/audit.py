from fastapi import APIRouter, Depends, UploadFile, File, Form, Response, HTTPException
from app.domain.models.audit_agent import (
    AuditRunRequest, AuditRunResponse,
    AuditHistoryRequest, AuditHistoryResponse
)
from app.agents.audit_agent import AuditAgent
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from app.api.v1.endpoints.auth import get_current_user
from app.services.pdf_tools import get_pdf_from_db
from app.infrastructure.db import mongodb
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

router = APIRouter()

def get_audit_agent():
    vertex_ai = VertexAIClient()
    adk = ADKClient()
    return AuditAgent(vertex_ai, adk)

@router.post("/run", response_model=AuditRunResponse)
async def run_audit(
    audit_type: str = Form(...),
    audit_details: str = Form(...),  # JSON string, will parse below
    mongo_uri: str = Form(None),
    documents: list[UploadFile] = File([]),
    agent: AuditAgent = Depends(get_audit_agent),
    current_user=Depends(get_current_user)
):
    import json
    audit_details_dict = json.loads(audit_details)
    # Pass all data to the agent
    result = await agent.run_audit(
        audit_details=audit_details_dict,
        audit_type=audit_type,
        mongo_uri=mongo_uri,
        documents=documents,
        user_id=str(current_user.id),
        session_id=str(current_user.id)
    )
    return AuditRunResponse(
        adk_result=result.get("adk_result"),
        llm_result=result.get("llm_result"),
        score=result.get("score"),
        issues=result.get("issues"),
        report_sections=result.get("report_sections"),
        pdf_url=result.get("pdf_url")
    )

@router.get("/history", response_model=AuditHistoryResponse)
async def get_audit_history(
    user_id: str,
    agent: AuditAgent = Depends(get_audit_agent),
    current_user=Depends(get_current_user)
):
    history = await agent.get_history(user_id)
    return AuditHistoryResponse(history=history)

@router.get("/pdf/{file_id}", response_class=Response)
async def serve_pdf(file_id: str, current_user=Depends(get_current_user)):
    try:
        # Check ownership or admin
        fs = AsyncIOMotorGridFSBucket(mongodb.db)
        from bson.errors import InvalidId
        try:
            oid = ObjectId(file_id)
        except InvalidId:
            raise HTTPException(status_code=404, detail="Invalid file id")
        file_info = await fs.find({"_id": oid}).to_list(1)
        if not file_info:
            raise HTTPException(status_code=404, detail="PDF not found")
        file_doc = file_info[0]
        owner_id = file_doc.metadata.get("user_id") if file_doc.metadata else None
        if (owner_id != current_user.id) and (current_user.role != "admin"):
            raise HTTPException(status_code=403, detail="Not authorized to access this PDF")
        pdf_bytes = await get_pdf_from_db(mongodb.db, file_id)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"PDF not found: {e}") 