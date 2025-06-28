from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

class AuditIssue(BaseModel):
    severity: str
    description: str
    recommendation: str

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
    llm_result: Optional[dict] = None
    score: Optional[int] = None
    issues: Optional[List[AuditIssue]] = None
    report_sections: Optional[List[AuditReportSection]] = None
    pdf_url: Optional[str] = None

class AuditHistoryRequest(BaseModel):
    user_id: str

class AuditHistoryResponse(BaseModel):
    history: dict 