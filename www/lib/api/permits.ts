import BaseAPIClient, { APIError } from '.';

export interface ProjectDetails {
  prompt: string;
  [key: string]: any; // Allow additional properties
}

export interface PermitSuggestRequest {
  project_details: ProjectDetails;
}

export interface PermitSuggestResponse {
  requirements: string;
  adk_result: any;
  llm_result: string;
}

export interface PermitSubmissionRequest {
  permit_data: Record<string, any>;
}

export interface PermitSubmissionResponse {
  submission: any;
}

// New types for the analyze_permit endpoint
export interface PermitAnalysisRequest {
  project_description: string;
  location: string;
}

export interface RequiredDocument {
  document_type: string;
  description: string;
  requirements: string[];
  estimated_timeline: string;
}

export interface RegionSpecificRule {
  rule_type: string;
  description: string;
  compliance_requirements: string[];
  authority: string;
}

export interface ChecklistItem {
  item: string;
  description: string;
  required: boolean;
  estimated_time: string;
}

export interface PermitAnalysisResponse {
  project_summary: Record<string, any>;
  required_documents: RequiredDocument[];
  region_specific_rules: RegionSpecificRule[];
  pre_submission_checklist: ChecklistItem[];
}

class PermitApi extends BaseAPIClient {
  constructor() {
    super();
  }

  async analyzePermit(request: PermitAnalysisRequest): Promise<PermitAnalysisResponse> {
    try {
      return await this.makeRequest<PermitAnalysisResponse>('/chat/analyze_permit', {
        body: JSON.stringify(request),
        method: 'POST',
      });
    } catch (error) {
      console.error('Permit analysis failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to analyze permit requirements', 500);
    }
  }

  async suggestPermit(request: PermitSuggestRequest): Promise<PermitSuggestResponse> {
    try {
      return await this.makeRequest<PermitSuggestResponse>('/permits/suggest', {
        body: JSON.stringify(request),
        method: 'POST',
      });
    } catch (error) {
      console.error('Permit suggestion failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to get permit suggestions', 500);
    }
  }

  async submitPermit(request: PermitSubmissionRequest): Promise<PermitSubmissionResponse> {
    try {
      return await this.makeRequest<PermitSubmissionResponse>('/permits/submit', {
        body: JSON.stringify(request),
        method: 'POST',
      });
    } catch (error) {
      console.error('Permit submission failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to submit permit', 500);
    }
  }
}

export const permitApi = new PermitApi();