from pydantic import BaseModel
from typing import Any, Dict

class PermitSuggestRequest(BaseModel):
    project_details: Dict[str, Any]

class PermitSuggestResponse(BaseModel):
    requirements: str
    adk_result: dict
    llm_result: str

class PermitSubmissionRequest(BaseModel):
    permit_data: Dict[str, Any]

class PermitSubmissionResponse(BaseModel):
    submission: dict 