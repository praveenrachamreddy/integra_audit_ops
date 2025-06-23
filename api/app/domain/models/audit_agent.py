from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class AuditReportSection(BaseModel):
    title: str
    content: str
    flagged: bool

class AuditRunRequest(BaseModel):
    audit_details: Dict[str, Any]
    audit_type: Optional[str] = None  # New: type of audit
    mongo_uri: Optional[str] = None   # New: optional MongoDB URI
    # File uploads will be handled at the endpoint level

class AuditRunResponse(BaseModel):
    adk_result: Optional[dict] = None
    llm_result: Optional[str] = None
    score: Optional[int] = None
    issues: Optional[List[str]] = None
    report_sections: Optional[List[AuditReportSection]] = None
    pdf_url: Optional[str] = None

class AuditHistoryRequest(BaseModel):
    user_id: str

class AuditHistoryResponse(BaseModel):
    history: dict 