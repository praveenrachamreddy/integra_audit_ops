from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request Model ---

class ExplanationRequest(BaseModel):
    """
    Defines the user's query for an explanation.
    """
    query: str = Field(..., description="The user's question about a regulation, document, or process.")

# --- Intermediate and Response Models ---

class DeconstructedQuery(BaseModel):
    """
    The sub-questions identified by the deconstruction agent.
    """
    sub_questions: List[str] = Field(..., description="A list of specific questions to be researched.")

class FoundRegulation(BaseModel):
    """
    A piece of information found by the research agent.
    """
    source: str = Field(..., description="The source URL or document name for the information.")
    content: str = Field(..., description="The relevant snippet of text found.")

class ExplanationResponse(BaseModel):
    """
    The final, synthesized explanation provided to the user.
    """
    explanation: str = Field(..., description="The clear, synthesized answer to the user's query.")
    sources: List[FoundRegulation] = Field(..., description="A list of sources used to generate the explanation.") 