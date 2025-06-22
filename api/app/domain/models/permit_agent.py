from pydantic import BaseModel, Field
from typing import Any, Dict

class ProjectDetails(BaseModel):
    prompt: str = Field(..., description="Prompt for the agent")
    # Add more fields as needed
    class Config:
        extra = "allow"

class PermitSuggestRequest(BaseModel):
    project_details: ProjectDetails

class PermitSuggestResponse(BaseModel):
    requirements: str
    adk_result: dict
    llm_result: str

class PermitSubmissionRequest(BaseModel):
    permit_data: Dict[str, Any]

class PermitSubmissionResponse(BaseModel):
    submission: dict 