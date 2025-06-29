from typing import Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from app.agents.sub_agents.query_deconstructor import QueryDeconstructorAgent
from app.agents.sub_agents.regulation_finder import RegulationFinderAgent
from app.agents.sub_agents.synthesizer import SynthesizerAgent
from app.domain.models.explanation_orchestrator import ExplanationResponse

class ExplanationOrchestrator:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        # Instantiate the sub-agents
        self.deconstructor = QueryDeconstructorAgent(vertex_ai, adk)
        self.finder = RegulationFinderAgent(vertex_ai, adk)
        self.synthesizer = SynthesizerAgent(vertex_ai, adk)

    async def get_explanation(self, query: str, user_id: str, session_id: str) -> ExplanationResponse:
        # 1. Deconstruct the user's query
        sub_questions = await self.deconstructor.deconstruct_query(query, user_id, session_id)
        if not sub_questions:
            return ExplanationResponse(explanation="Could not understand the question. Please rephrase it.", sources=[])

        # 2. Find relevant regulations for the sub-questions
        findings = await self.finder.find_regulations(sub_questions, user_id, session_id)
        if not findings:
            return ExplanationResponse(explanation="Could not find any relevant information for your query.", sources=[])
            
        # 3. Synthesize the final explanation
        explanation_text = await self.synthesizer.synthesize_explanation(query, findings, user_id, session_id)
        
        # 4. Assemble and return the final response object
        return ExplanationResponse(
            explanation=explanation_text,
            sources=findings
        ) 