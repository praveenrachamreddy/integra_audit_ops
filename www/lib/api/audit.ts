import BaseApiClient, { APIError, } from '.';

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

class AuditApi extends BaseApiClient {
  constructor() {
    super();
    this.apiPath = '/audit';
  }

  async runAudit(
    auditRequest: AuditRunRequest,
    documents?: File[],
    systemLogs?: File[]
  ): Promise<AuditRunResponse> {
    try {
      const formData = new FormData();
      
    formData.append('audit_type', auditRequest.audit_type ?? 'general');
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

    return await this.makeRequest<AuditRunResponse>('/run', {
      method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Audit run failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to run audit', 500);
    }
  }


  async getAuditHistory(userId: string): Promise<AuditHistoryResponse> {
    try {
      return await this.makeRequest<AuditHistoryResponse>('/history?user_id=${userId}', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Audit history failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to get audit history', 500);
    }
  }

  async downloadPdf(fileId: string): Promise<Blob> {
    try {
      return await this.makeRequest<Blob>('/pdf/${fileId}', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Audit history failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to get audit history', 500);
    }
  }

}

export const auditApi = new AuditApi(); 