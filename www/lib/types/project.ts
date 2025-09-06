export interface ClientInfo {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address?: string;
  industry?: string;
}

export type ProjectStatus = 
  | 'planning'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export type ProjectType = 
  | 'web_development'
  | 'mobile_app'
  | 'enterprise_software'
  | 'infrastructure'
  | 'consulting'
  | 'audit';

export interface Project {
  id: string;
  name: string;
  description: string;
  project_type: ProjectType;
  client: ClientInfo;
  start_date: string;
  end_date?: string;
  budget?: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
  project_type: ProjectType;
  client: ClientInfo;
  start_date: string;
  end_date?: string;
  budget?: number;
  status?: ProjectStatus;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  project_type?: ProjectType;
  client?: ClientInfo;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: ProjectStatus;
}