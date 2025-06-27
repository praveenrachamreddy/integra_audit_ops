import { authApi } from './auth';

export interface AuditReportSection {
  title: string;
  content: string;
  flagged: boolean;
}

export interface AuditRunRequest {
  audit_details: Record<string, any>;
  audit_type?: string;
  mongo_uri?: string;
}

export interface AuditRunResponse {
  adk_result?: any;
  llm_result?: string;
  score?: number;
  issues?: string[];
  report_sections?: AuditReportSection[];
  pdf_url?: string;
}

export interface AuditHistoryResponse {
  history: any;
}

class AuditApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private apiPath = '/api/v1/audit';

  async runAudit(
    auditRequest: AuditRunRequest,
    documents?: File[],
    systemLogs?: File[]
  ): Promise<AuditRunResponse> {
    const formData = new FormData();
    
    formData.append('audit_type', auditRequest.audit_type || 'general');
    formData.append('audit_details', JSON.stringify(auditRequest.audit_details));
    
    if (auditRequest.mongo_uri) {
      formData.append('mongo_uri', auditRequest.mongo_uri);
    }

    // Add document files
    if (documents) {
      documents.forEach((file) => {
        formData.append('documents', file);
      });
    }

    // Add system log files
    if (systemLogs) {
      systemLogs.forEach((file) => {
        formData.append('system_logs', file);
      });
    }

    const response = await fetch(`${this.baseUrl}${this.apiPath}/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authApi.getAccessToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || 'Failed to run audit');
    }

    return response.json();
  }

  async getAuditHistory(userId: string): Promise<AuditHistoryResponse> {
    const response = await fetch(`${this.baseUrl}${this.apiPath}/history?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authApi.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || 'Failed to get audit history');
    }

    return response.json();
  }

  async downloadPdf(fileId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${this.apiPath}/pdf/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authApi.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    return response.blob();
  }
}

export const auditApi = new AuditApi(); 