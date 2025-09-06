import BaseApiClient from '.';
import { Project, ProjectCreate, ProjectUpdate, ProjectStatus, ProjectType } from '@/lib/types/project';

class ProjectsApi extends BaseApiClient {
  constructor() {
    super();
    this.apiPath = '/projects';
  }

  async createProject(project: ProjectCreate): Promise<Project> {
    return await this.makeRequest<Project>('/', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProjects(status?: ProjectStatus, projectType?: ProjectType): Promise<Project[]> {
    let url = '/';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (projectType) params.append('project_type', projectType);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await this.makeRequest<Project[]>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getProject(projectId: string): Promise<Project> {
    return await this.makeRequest<Project>(`/${projectId}`, {
      method: 'GET',
    });
  }

  async updateProject(projectId: string, project: ProjectUpdate): Promise<Project> {
    return await this.makeRequest<Project>(`/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }
}

export const projectsApi = new ProjectsApi();