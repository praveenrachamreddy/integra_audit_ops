# IntegraOps - Technical Implementation Guide

## Project Structure Customization

### 1. Branding Updates

#### 1.1 Update Project Configuration Files

**Update package.json (www/package.json):**
```json
{
  "name": "integra-ops-platform",
  "version": "1.0.0",
  "private": true,
  "description": "Integra's AI-powered compliance and project management platform",
  "author": "Integra Operations Team",
  // ... rest of package.json
}
```

**Update API configuration (api/app/core/config.py):**
```python
class Settings(BaseSettings):
    # ... existing settings ...
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "IntegraOps API")
    COMPANY_NAME: str = os.getenv("COMPANY_NAME", "Integra")
    PLATFORM_NAME: str = os.getenv("PLATFORM_NAME", "IntegraOps")
```

#### 1.2 Update UI Components

**Create Integra branding component (www/components/layout/integra-branding.tsx):**
```tsx
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface IntegraBrandingProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg';
}

export function IntegraBranding({ 
  size = 'md', 
  className, 
  ...props 
}: IntegraBrandingProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={cn(
        'font-bold flex items-center gap-2',
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      <div className="bg-blue-600 text-white p-1 rounded">
        <span className="font-bold">I</span>
      </div>
      <span>ntegra<span className="text-blue-600">Ops</span></span>
    </div>
  );
}
```

### 2. Project Management Features

#### 2.1 Add Project Model

**Create project model (api/app/domain/models/project.py):**
```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectType(str, Enum):
    WEB_DEVELOPMENT = "web_development"
    MOBILE_APP = "mobile_app"
    ENTERPRISE_SOFTWARE = "enterprise_software"
    INFRASTRUCTURE = "infrastructure"
    CONSULTING = "consulting"
    AUDIT = "audit"

class ClientInfo(BaseModel):
    id: str
    name: str
    contact_person: str
    email: str
    phone: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: str
    project_type: ProjectType
    client: ClientInfo
    start_date: datetime
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    status: ProjectStatus = ProjectStatus.PLANNING

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    status: Optional[ProjectStatus] = None

class ProjectInDB(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str  # User ID
```

#### 2.2 Add Project Endpoints

**Create project endpoints (api/app/api/v1/endpoints/projects.py):**
```python
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.infrastructure.db import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.domain.models.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectInDB,
    ProjectStatus
)
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ProjectInDB)
async def create_project(
    project: ProjectCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new project"""
    project_dict = project.dict()
    project_dict["created_at"] = datetime.utcnow()
    project_dict["updated_at"] = datetime.utcnow()
    project_dict["created_by"] = str(current_user.id)
    
    result = await db.projects.insert_one(project_dict)
    project_dict["id"] = str(result.inserted_id)
    
    return ProjectInDB(**project_dict)

@router.get("/", response_model=List[ProjectInDB])
async def list_projects(
    status: Optional[ProjectStatus] = None,
    project_type: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all projects with optional filtering"""
    query = {}
    if status:
        query["status"] = status.value
    if project_type:
        query["project_type"] = project_type
    
    cursor = db.projects.find(query).sort("created_at", -1)
    projects = []
    
    async for project in cursor:
        project["id"] = str(project.pop("_id"))
        projects.append(ProjectInDB(**project))
    
    return projects

@router.get("/{project_id}", response_model=ProjectInDB)
async def get_project(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific project by ID"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project["id"] = str(project.pop("_id"))
        return ProjectInDB(**project)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

@router.put("/{project_id}", response_model=ProjectInDB)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a project"""
    try:
        existing_project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        update_data = project_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
        updated_project["id"] = str(updated_project.pop("_id"))
        
        return ProjectInDB(**updated_project)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")
```

#### 2.3 Update Main API Router

**Update main.py to include projects router:**
```python
# In api/app/main.py, add to imports:
from app.api.v1.endpoints import projects

# Add to router includes:
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])
```

### 3. Client Management Features

#### 3.1 Add Client Model

**Create client model (api/app/domain/models/client.py):**
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientInDB(ClientBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str  # User ID
```

#### 3.2 Add Client Endpoints

**Create client endpoints (api/app/api/v1/endpoints/clients.py):**
```python
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.infrastructure.db import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.domain.models.client import ClientCreate, ClientUpdate, ClientInDB
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ClientInDB)
async def create_client(
    client: ClientCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new client"""
    client_dict = client.dict()
    client_dict["created_at"] = datetime.utcnow()
    client_dict["updated_at"] = datetime.utcnow()
    client_dict["created_by"] = str(current_user.id)
    
    result = await db.clients.insert_one(client_dict)
    client_dict["id"] = str(result.inserted_id)
    
    return ClientInDB(**client_dict)

@router.get("/", response_model=List[ClientInDB])
async def list_clients(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all clients"""
    cursor = db.clients.find().sort("name", 1)
    clients = []
    
    async for client in cursor:
        client["id"] = str(client.pop("_id"))
        clients.append(ClientInDB(**client))
    
    return clients

@router.get("/{client_id}", response_model=ClientInDB)
async def get_client(
    client_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific client by ID"""
    try:
        client = await db.clients.find_one({"_id": ObjectId(client_id)})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        client["id"] = str(client.pop("_id"))
        return ClientInDB(**client)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid client ID")

@router.put("/{client_id}", response_model=ClientInDB)
async def update_client(
    client_id: str,
    client_update: ClientUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a client"""
    try:
        existing_client = await db.clients.find_one({"_id": ObjectId(client_id)})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        update_data = client_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db.clients.update_one(
            {"_id": ObjectId(client_id)},
            {"$set": update_data}
        )
        
        updated_client = await db.clients.find_one({"_id": ObjectId(client_id)})
        updated_client["id"] = str(updated_client.pop("_id"))
        
        return ClientInDB(**updated_client)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid client ID")
```

### 4. Frontend Integration

#### 4.1 Update Frontend Types

**Create project types (www/lib/types/project.ts):**
```typescript
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
```

#### 4.2 Create Project API Service

**Create project API service (www/lib/api/projects.ts):**
```typescript
import BaseApiClient from '.';
import { Project, ProjectCreate, ProjectUpdate, ProjectStatus } from '@/lib/types/project';

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

  async getProjects(status?: ProjectStatus, projectType?: string): Promise<Project[]> {
    let url = '/';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (projectType) params.append('project_type', projectType);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await this.makeRequest<Project[]>(url, {
      method: 'GET',
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
```

#### 4.3 Create Project Dashboard Component

**Create project dashboard (www/components/dashboard/projects-dashboard.tsx):**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { projectsApi } from '@/lib/api/projects';
import { Project, ProjectStatus, ProjectType } from '@/lib/types/project';
import { toast } from 'sonner';

const projectStatuses: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-gray-100 text-gray-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'enterprise_software', label: 'Enterprise Software' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'audit', label: 'Audit' },
];

export function ProjectsDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ProjectType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: 'web_development' as ProjectType,
    client: {
      id: '',
      name: '',
      contact_person: '',
      email: '',
    },
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    budget: '',
    status: 'planning' as ProjectStatus,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filterStatus, filterType, searchTerm]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectsApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...projects];
    
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    if (filterType !== 'all') {
      result = result.filter(project => project.project_type === filterType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.client.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProjects(result);
  };

  const handleCreateProject = async () => {
    try {
      const projectData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };
      
      await projectsApi.createProject(projectData);
      toast.success('Project created successfully');
      setShowCreateDialog(false);
      loadProjects();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        project_type: 'web_development',
        client: {
          id: '',
          name: '',
          contact_person: '',
          email: '',
        },
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        budget: '',
        status: 'planning',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const statusInfo = projectStatuses.find(s => s.value === status);
    return statusInfo ? (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    ) : (
      <Badge>{status}</Badge>
    );
  };

  const getTypeLabel = (type: ProjectType) => {
    const typeInfo = projectTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.label : type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your client projects and track progress
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select 
                    value={formData.project_type} 
                    onValueChange={(value) => setFormData({...formData, project_type: value as ProjectType})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Describe the project..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    value={formData.client.name}
                    onChange={(e) => setFormData({
                      ...formData, 
                      client: {...formData.client, name: e.target.value}
                    })}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Enter project budget"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select 
                value={filterStatus} 
                onValueChange={(value) => setFilterStatus(value as ProjectStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {projectStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={filterType} 
                onValueChange={(value) => setFilterType(value as ProjectType | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold">
                  {new Set(projects.map(p => p.client.id)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            {filteredProjects.length} of {projects.length} projects displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.client.name} • {getTypeLabel(project.project_type)}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Start: {new Date(project.start_date).toLocaleDateString()}
                        </span>
                        {project.budget && (
                          <span>
                            Budget: ${project.budget.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5. Update Dashboard Navigation

#### 5.1 Add Projects to Dashboard Navigation

**Update dashboard routes (www/app/dashboard/[...slug]/page.tsx):**
```typescript
import { notFound } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { AuditGenieContent } from '@/components/dashboard/audit-genie-content';
import { AssistantContent } from '@/components/dashboard/assistant-content';
import { QAContent } from '@/components/dashboard/qa-content';
import { DocumentsContent } from '@/components/dashboard/documents-content';
import { SettingsContent } from '@/components/dashboard/settings-content';
import { HelpContent } from '@/components/dashboard/help-content';
import { ProjectsDashboard } from '@/components/dashboard/projects-dashboard'; // Add this import

// Map of valid routes to their components
const routeComponents = {
  'overview': DashboardOverview,
  'audit': AuditGenieContent,
  'assistant': AssistantContent,
  'qa': QAContent,
  'documents': DocumentsContent,
  'settings': SettingsContent,
  'help': HelpContent,
  'projects': ProjectsDashboard, // Add this line
} as const;

// ... rest of the file remains the same
```

#### 5.2 Update Dashboard Navigation Menu

**Update dashboard overview (www/components/dashboard/dashboard-overview.tsx):**
```typescript
// Add to quickActions array:
{
  title: 'Projects',
  description: 'Manage client projects',
  icon: Building2,
  href: '/dashboard/projects',
  color: 'text-indigo-600',
  bgColor: 'bg-indigo-100 dark:bg-indigo-900',
  badge: 'New'
},

// Add to tools array:
{
  title: 'Project Reports',
  description: 'View project analytics',
  icon: FileText,
  href: '/dashboard/projects',
  color: 'text-cyan-600',
  bgColor: 'bg-cyan-100 dark:bg-cyan-900'
}
```

### 6. Audit Integration with Projects

#### 6.1 Update Audit Models

**Update audit models to include project references (api/app/domain/models/audit_orchestrator.py):**
```python
# Add to AuditRunRequest model:
class AuditRunRequest(BaseModel):
    audit_type: str
    company_name: str
    audit_scope: str
    control_families: List[str]
    project_id: Optional[str] = None  # Add this line
    # ... existing fields
```

#### 6.2 Update Audit Endpoints

**Update audit run endpoint to associate with projects:**
```python
# In api/app/api/v1/endpoints/audit.py
@router.post("/run", response_model=AuditRunResponse)
async def run_audit(
    audit_type: str = Form(...),
    company_name: str = Form(...),
    audit_scope: str = Form(...),
    control_families: str = Form(..., description="A comma-separated list of control families to evaluate."),
    project_id: Optional[str] = Form(None),  # Add this parameter
    documents: list[UploadFile] = File(...),
    orchestrator: AuditOrchestrator = Depends(get_audit_orchestrator),
    current_user=Depends(get_current_user)
):
    # Split the comma-separated string into a list
    control_families_list = [item.strip() for item in control_families.split(',')]

    result = await orchestrator.run_audit(
        audit_type=audit_type,
        company_name=company_name,
        audit_scope=audit_scope,
        control_families=control_families_list,
        documents=documents,
        user_id=str(current_user.id),
        session_id=str(current_user.id),
        project_id=project_id  # Pass project_id to orchestrator
    )
    return result
```

#### 6.3 Update Audit Orchestrator

**Update audit orchestrator to handle project associations:**
```python
# In api/app/agents/audit_orchestrator.py
async def run_audit(self, audit_type: str, company_name: str, audit_scope: str, 
                   control_families: list, documents: List[UploadFile], 
                   user_id: str, session_id: str, project_id: Optional[str] = None):
    # ... existing code ...
    
    # Add project_id to metadata when saving PDF
    pdf_id = await save_pdf_file_to_db(
        mongodb.db,
        pdf_path,
        f"audit_report_{user_id}.pdf",
        metadata={
            "user_id": str(user_id), 
            "type": "generated",
            "score": score,
            "company_name": company_name,
            "project_id": project_id  # Add this line
        }
    )
    
    # ... rest of existing code ...
```

### 7. Development-Specific Features

#### 7.1 Create Development Audit Templates

**Create development-specific audit templates (api/app/agents/prompts/dev_compliance_scanner_prompt.txt):**
```
You are an AI Compliance Analyst for software development projects at Integra. 
Your task is to analyze development projects for compliance with industry standards and best practices.

Project Details:
- Type: {project_type}
- Client: {company_name}
- Scope: {audit_scope}
- Control Families: {control_families}

Document IDs for review:
{doc_ids}

For each document, analyze it for compliance issues in the following areas:
1. Code Quality Standards
2. Security Best Practices
3. Documentation Completeness
4. Testing Coverage
5. Deployment Process Adherence

Return a JSON object with the following structure:
{
  "issues": [
    {
      "severity": "High|Medium|Low",
      "description": "Brief description of the issue",
      "recommendation": "Specific recommendation for remediation"
    }
  ]
}

Focus specifically on development project compliance for Integra's service-based model.
```

#### 7.2 Create Development Audit Agent

**Create development audit agent (api/app/agents/sub_agents/dev_compliance_scanner.py):**
```python
import asyncio
import json
import re
import os
from typing import AsyncGenerator, Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from app.services.pdf_tools import extract_pdf_content
from app.infrastructure.db import mongodb
from bson import ObjectId

class DevComplianceScannerAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        
        # Define a simple ASYNC wrapper function that the ADK can easily parse.
        async def get_document_content(file_id: str) -> str:
            """
            Retrieves the text content of a document given its file ID.
            Use this tool to read the documents provided to you to find compliance issues.
            """
            return await extract_pdf_content(mongodb.db, ObjectId(file_id))

        self.tools = [get_document_content]
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        """Loads the prompt template from the file system."""
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, '..', 'prompts', 'dev_compliance_scanner_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return "Error: Development scanner prompt template not found."

    async def stream_issues(
        self,
        project_type: str,
        company_name: str,
        audit_scope: str,
        control_families: list,
        doc_ids: list,
        user_id: str,
        session_id: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        
        if "Error" in self.prompt_template:
            yield {"error": self.prompt_template}
            return

        prompt = self.prompt_template.format(
            project_type=project_type,
            company_name=company_name,
            audit_scope=audit_scope,
            control_families=control_families,
            doc_ids=[str(doc_id) for doc_id in doc_ids]
        )
        
        agent_input = {"prompt": prompt}
        instruction = "You are an AI Compliance Analyst for software development projects. Follow the prompt and return only the requested JSON."

        adk_result = await self.adk.run_agent(
            agent_name="dev_compliance_scanner",
            data=agent_input,
            instruction=instruction,
            user_id=user_id,
            session_id=session_id,
            tools=self.tools
        )

        if adk_result and adk_result.get("result"):
            raw_response = adk_result.get("result")
            # Use regex to robustly find the JSON block, even with markdown backticks
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else raw_response
            
            try:
                parsed_json = json.loads(json_str)
                issues = parsed_json.get("issues", [])
                for issue in issues:
                    yield issue
            except json.JSONDecodeError:
                yield {"error": "Failed to parse JSON from scanner", "raw_response": raw_response}
        else:
            yield {"error": "No result from ADK agent"}
```

### 8. Reporting Features

#### 8.1 Create Project-Based Reports

**Update PDF tools to include project information (api/app/services/pdf_tools.py):**
```python
# Add to generate_pdf_report function parameters:
def generate_pdf_report(
    sections: Optional[List[dict]],
    score: Optional[int],
    issues: Optional[List[dict]],
    overall_severity: str,
    project_info: Optional[dict] = None,  # Add this parameter
    output_dir: Optional[str] = None
) -> str:
    # ... existing code ...
    
    # Add project information to the report if provided
    if project_info:
        story.append(Paragraph(f"Project: {project_info.get('name', 'N/A')}", styles['BodyText']))
        story.append(Paragraph(f"Client: {project_info.get('client_name', 'N/A')}", styles['BodyText']))
        story.append(Paragraph(f"Project Type: {project_info.get('type', 'N/A')}", styles['BodyText']))
        story.append(Spacer(1, 12))
    
    # ... rest of existing code ...
```

### 9. Database Updates

#### 9.1 Create Database Collections

**Update database initialization (api/app/infrastructure/db.py):**
```python
# Add to init_db function:
def init_db(app: FastAPI):
    """Initialize MongoDB client and attach to app."""
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.db = mongodb.client[settings.DATABASE_NAME]
    app.mongodb_client = mongodb.client
    app.mongodb = mongodb.db
    
    # Create indexes for better performance
    asyncio.create_task(create_indexes(mongodb.db))

async def create_indexes(db):
    """Create database indexes for better query performance."""
    # Users collection indexes
    await db.users.create_index("email", unique=True)
    
    # Projects collection indexes
    await db.projects.create_index("client.id")
    await db.projects.create_index("status")
    await db.projects.create_index("project_type")
    await db.projects.create_index([("name", "text"), ("description", "text")])
    
    # Clients collection indexes
    await db.clients.create_index("name")
    await db.clients.create_index("email")
    
    # Audit reports indexes
    await db.fs.files.create_index("metadata.project_id")
    await db.fs.files.create_index("metadata.user_id")
    await db.fs.files.create_index("metadata.type")
```

This technical implementation guide provides the foundation for customizing RegOps into IntegraOps. It covers:

1. Branding updates for the Integra name
2. Project management features specific to service-based companies
3. Client management system
4. Frontend integration with new components
5. Audit integration with projects
6. Development-specific compliance features
7. Enhanced reporting capabilities
8. Database optimizations

The next steps would be to implement these changes incrementally, starting with the branding and basic project management features, then adding the more complex integrations.