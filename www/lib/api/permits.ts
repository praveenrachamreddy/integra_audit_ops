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

class PermitApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private apiPath = '/api/v1/permits';

  async suggestPermit(request: PermitSuggestRequest): Promise<PermitSuggestResponse> {
    const response = await fetch(`${this.baseUrl}${this.apiPath}/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authApi.getAccessToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || 'Failed to get permit suggestions');
    }

    return response.json();
  }

  async submitPermit(request: PermitSubmissionRequest): Promise<PermitSubmissionResponse> {
    const response = await fetch(`${this.baseUrl}${this.apiPath}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authApi.getAccessToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || 'Failed to submit permit');
    }

    return response.json();
  }
}

export const permitApi = new PermitApi(); 