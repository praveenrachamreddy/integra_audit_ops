from pydantic import BaseModel
from typing import Any, Dict

class ExplanationRequest(BaseModel):
    query: Dict[str, Any]

class ExplanationResponse(BaseModel):
    adk_result: dict
    llm_result: str 