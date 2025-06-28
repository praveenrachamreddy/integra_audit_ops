from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

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

# --- Request Models ---

class PermitAnalysisRequest(BaseModel):
    """
    Defines the structured data required for a permit analysis request.
    """
    project_description: str = Field(..., description="A plain-English description of the project.")
    location: str = Field(..., description="The city, state, or address where the project will take place.")

# --- Response Models ---

class RequiredDocument(BaseModel):
    document_name: str = Field(..., description="The name of the required document, form, or plan.")
    description: str = Field(..., description="A brief explanation of what this document is for.")

class RegionSpecificRule(BaseModel):
    rule_summary: str = Field(..., description="A summary of the region-specific rule or ordinance.")
    source_url: Optional[str] = Field(None, description="The URL where the rule was found, if available.")

class ChecklistItem(BaseModel):
    item_name: str = Field(..., description="The name of the document or task.")
    status: str = Field(..., description="The current status, e.g., 'Missing' or 'Information Required'.")
    details: str = Field(..., description="Details about why this item is needed or what is missing.")

class PermitAnalysisResponse(BaseModel):
    """
    The final, structured response containing the full permit analysis.
    """
    project_summary: dict = Field(..., description="A structured summary of the project intent as understood by the AI.")
    required_documents: List[RequiredDocument] = Field(..., description="A list of documents generally required for this type of project.")
    region_specific_rules: List[RegionSpecificRule] = Field(..., description="A list of rules and ordinances specific to the provided location.")
    pre_submission_checklist: List[ChecklistItem] = Field(..., description="A final checklist for the user to follow before submission.") 