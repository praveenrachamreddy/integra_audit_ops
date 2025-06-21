from pydantic import BaseModel
from typing import Any, Dict

class AuditRunRequest(BaseModel):
    audit_details: Dict[str, Any]

class AuditRunResponse(BaseModel):
    adk_result: dict
    llm_result: str

class AuditHistoryRequest(BaseModel):
    user_id: str

class AuditHistoryResponse(BaseModel):
    history: dict 