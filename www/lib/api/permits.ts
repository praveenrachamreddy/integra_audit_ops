import { authApi } from './auth';

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

class PermitApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private apiPath = '/api/v1';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authApi.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}${this.apiPath}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Session-ID': `session_${Date.now()}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async analyzePermit(request: PermitAnalysisRequest): Promise<PermitAnalysisResponse> {
    try {
      return await this.makeRequest<PermitAnalysisResponse>('/chat/analyze_permit', {
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Permit analysis failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze permit requirements');
    }
  }

  async suggestPermit(request: PermitSuggestRequest): Promise<PermitSuggestResponse> {
    try {
      return await this.makeRequest<PermitSuggestResponse>('/permits/suggest', {
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Permit suggestion failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get permit suggestions');
    }
  }

  async submitPermit(request: PermitSubmissionRequest): Promise<PermitSubmissionResponse> {
    try {
      return await this.makeRequest<PermitSubmissionResponse>('/permits/submit', {
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Permit submission failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to submit permit');
    }
  }
}

export const permitApi = new PermitApi(); 