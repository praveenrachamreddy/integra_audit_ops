import BaseApiClient, { APIError } from '.';

// Match backend models exactly
export interface AuditIssue {
  severity: string;
  description: string;
  recommendation: string;
}

export interface AuditReportSection {
  title: string;
  content: string;
  flagged: boolean;
}

// Match backend request structure
export interface AuditRunRequest {
  audit_type: string;
  company_name: string;
  audit_scope: string;
  control_families: string[]; // Will be converted to comma-separated string
}

// Match backend response structure
export interface AuditRunResponse {
  score?: number;
  issues?: AuditIssue[];
  report_sections?: AuditReportSection[];
  pdf_url?: string;
}

// Match backend history item structure
export interface AuditHistoryItem {
  audit_id: string;
  company_name: string;
  run_date: string;
  score: number;
  pdf_url: string;
}

class AuditApi extends BaseApiClient {
  constructor() {
    super();
    this.apiPath = '/audit';
  }

  async runAudit(
    auditRequest: AuditRunRequest,
    documents: File[]
  ): Promise<AuditRunResponse> {
    try {
      const formData = new FormData();
      
      // Match backend form field names exactly
      formData.append('audit_type', auditRequest.audit_type);
      formData.append('company_name', auditRequest.company_name);
      formData.append('audit_scope', auditRequest.audit_scope);
      formData.append('control_families', auditRequest.control_families.join(', '));

      // Add document files
      documents.forEach((file) => {
        formData.append('documents', file);
      });

      return await this.makeRequest<AuditRunResponse>('/run', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Audit run failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to run audit', 500);
    }
  }

  async getAuditHistory(): Promise<AuditHistoryItem[]> {
    try {
      // Backend returns list directly, no userId param needed (uses JWT)
      return await this.makeRequest<AuditHistoryItem[]>('/history', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Audit history failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to get audit history', 500);
    }
  }

  async downloadPdf(fileId: string): Promise<Blob> {
    try {
      return await this.makeRequest<Blob>(`/pdf/${fileId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to download PDF', 500);
    }
  }
}

export const auditApi = new AuditApi(); 