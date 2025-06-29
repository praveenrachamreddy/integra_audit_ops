import asyncio
from typing import List, Dict, Any
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from app.agents.sub_agents.intent_extractor import IntentExtractorAgent
from app.agents.sub_agents.policy_expert import PolicyExpertAgent
from app.agents.sub_agents.location_agent import LocationAgent
from app.agents.sub_agents.pre_submission_validator import PreSubmissionValidatorAgent

class PermitOrchestrator:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        # Instantiate the sub-agents
        self.intent_extractor = IntentExtractorAgent(vertex_ai, adk)
        self.policy_expert = PolicyExpertAgent(vertex_ai, adk)
        self.location_agent = LocationAgent(vertex_ai, adk)
        self.validator = PreSubmissionValidatorAgent(vertex_ai, adk)

    async def analyze_permit_request(self, project_description: str, location: str, user_id: str, session_id: str) -> Dict[str, Any]:
        # 1. Extract structured intent from the user's description
        project_summary = await self.intent_extractor.extract_intent(project_description, user_id, session_id)
        if "error" in project_summary:
            return {"error": "Failed at intent extraction stage", "details": project_summary}

        # 2. Concurrently run the policy and location agents
        policy_task = self.policy_expert.get_general_requirements(project_summary, user_id, session_id)
        location_task = self.location_agent.get_regional_rules(project_summary, location, user_id, session_id)
        
        results = await asyncio.gather(policy_task, location_task)
        required_documents = results[0]
        region_specific_rules = results[1]

        # 3. Run the final validator agent to create a checklist
        checklist = await self.validator.create_checklist(required_documents, region_specific_rules, user_id, session_id)

        # 4. Assemble and return the final response
        return {
            "project_summary": project_summary,
            "required_documents": required_documents,
            "region_specific_rules": region_specific_rules,
            "pre_submission_checklist": checklist
        } 