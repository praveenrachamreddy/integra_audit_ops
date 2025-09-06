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
    """
    Defines the structured data for an audit request.
    Note: In the endpoint, these are sent as form fields, not a single JSON body.
    """
    audit_type: str
    company_name: str
    audit_scope: str
    control_families: List[str]
    project_id: Optional[str] = None

class AuditRunResponse(BaseModel):
    """
    The final, clean response containing only the essential, structured audit results.
    """
    score: Optional[int] = None
    issues: Optional[List[AuditIssue]] = None
    report_sections: Optional[List[AuditReportSection]] = None
    pdf_url: Optional[str] = None

class AuditHistoryRequest(BaseModel):
    user_id: str

class AuditHistoryResponse(BaseModel):
    """
    The final, clean response containing only the essential, structured audit results.
    """
    audit_id: str
    company_name: str
    run_date: str
    score: int
    pdf_url: str
    project_id: Optional[str] = None 