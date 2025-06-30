import BaseApiClient, { APIError } from '.';

export interface ExplanationRequest {
  query: string;
}

export interface FoundRegulation {
  source: string;
  content: string;
}

export interface ExplanationResponse {
  explanation: string;
  sources: FoundRegulation[];
}

class ExplainApi extends BaseApiClient {
  constructor() {
    super();
    this.apiPath = '/explain';
  }

  async getExplanation(query: string, sessionId?: string): Promise<ExplanationResponse> {
    try {
      const headers: Record<string, string> = {};
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      }

      return await this.makeRequest<ExplanationResponse>('/', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers,
      });
    } catch (error) {
      console.error('Explanation request failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to get explanation', 500);
    }
  }
}

export const explainApi = new ExplainApi(); 