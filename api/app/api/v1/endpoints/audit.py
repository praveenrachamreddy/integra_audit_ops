from fastapi import APIRouter, Depends, UploadFile, File, Form, Response, HTTPException
from app.domain.models.audit_orchestrator import AuditRunResponse, AuditHistoryResponse
from app.agents.audit_orchestrator import AuditOrchestrator
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from app.api.v1.endpoints.auth import get_current_user
from app.services.pdf_tools import get_pdf_from_db
from app.infrastructure.db import mongodb
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

router = APIRouter()

def get_audit_orchestrator():
    vertex_ai = VertexAIClient()
    adk = ADKClient()
    return AuditOrchestrator(vertex_ai, adk)

@router.post("/run", response_model=AuditRunResponse)
async def run_audit(
    audit_type: str = Form(...),
    company_name: str = Form(...),
    audit_scope: str = Form(...),
    control_families: str = Form(..., description="A comma-separated list of control families to evaluate."),
    project_id: Optional[str] = Form(None),
    documents: list[UploadFile] = File(...),
    orchestrator: AuditOrchestrator = Depends(get_audit_orchestrator),
    current_user=Depends(get_current_user)
):
    # Split the comma-separated string into a list
    control_families_list = [item.strip() for item in control_families.split(',')]

    result = await orchestrator.run_audit(
        audit_type=audit_type,
        company_name=company_name,
        audit_scope=audit_scope,
        control_families=control_families_list,
        documents=documents,
        user_id=str(current_user.id),
        session_id=str(current_user.id),
        project_id=project_id
    )
    return result

@router.get("/history", response_model=list)
async def get_audit_history(
    orchestrator: AuditOrchestrator = Depends(get_audit_orchestrator),
    current_user=Depends(get_current_user)
):
    """
    Retrieves the audit history for the currently authenticated user.
    """
    user_id = current_user.id
    if not user_id:
        raise HTTPException(status_code=403, detail="User ID not found in token.")

    history = await orchestrator.get_history(user_id)
    return history

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
        metadata = file_doc.get("metadata")
        owner_id = metadata.get("user_id") if metadata else None
        
        user_id = current_user.id
        user_role = current_user.role

        if (owner_id != str(user_id)) and (user_role != "admin"):
            raise HTTPException(status_code=403, detail="Not authorized to access this PDF")
        
        pdf_bytes = await get_pdf_from_db(mongodb.db, file_id)

        # Add a Content-Disposition header to encourage browsers to download the file.
        headers = {
            'Content-Disposition': f'attachment; filename="audit_report_{file_id}.pdf"'
        }
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}") 