'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  MapPin,
  Calendar,
  DollarSign,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const mockPermits = [
  {
    id: 'PRM-2024-001',
    title: 'Commercial Building Construction',
    type: 'Building Permit',
    status: 'approved',
    location: 'San Francisco, CA',
    submittedDate: '2024-01-15',
    approvalDate: '2024-01-28',
    fee: '$2,500',
    description: 'New 5-story commercial building construction'
  },
  {
    id: 'PRM-2024-002',
    title: 'Environmental Impact Assessment',
    type: 'Environmental Permit',
    status: 'pending',
    location: 'Oakland, CA',
    submittedDate: '2024-02-01',
    fee: '$1,200',
    description: 'Environmental impact study for industrial facility'
  },
  {
    id: 'PRM-2024-003',
    title: 'Food Service License',
    type: 'Health Permit',
    status: 'review',
    location: 'Berkeley, CA',
    submittedDate: '2024-02-10',
    fee: '$350',
    description: 'Restaurant food service license application'
  },
  {
    id: 'PRM-2024-004',
    title: 'Zoning Variance Request',
    type: 'Zoning Permit',
    status: 'rejected',
    location: 'Palo Alto, CA',
    submittedDate: '2024-01-20',
    rejectionDate: '2024-02-05',
    fee: '$800',
    description: 'Request for commercial use in residential zone'
  }
];

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-500', label: 'Pending Review' },
  review: { icon: AlertCircle, color: 'bg-blue-500', label: 'Under Review' },
  approved: { icon: CheckCircle, color: 'bg-green-500', label: 'Approved' },
  rejected: { icon: XCircle, color: 'bg-red-500', label: 'Rejected' }
};

export function SmartPermitContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewPermitForm, setShowNewPermitForm] = useState(false);

  const filteredPermits = mockPermits.filter(permit => {
    const matchesSearch = permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || permit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockPermits.length,
    approved: mockPermits.filter(p => p.status === 'approved').length,
    pending: mockPermits.filter(p => p.status === 'pending').length,
    review: mockPermits.filter(p => p.status === 'review').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            SmartPermit
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered permit management and application system
          </p>
        </div>
        <Button onClick={() => setShowNewPermitForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Permits</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{stats.review}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permits by title, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Permits List */}
      <div className="grid gap-4">
        {filteredPermits.map((permit, index) => {
          const statusInfo = statusConfig[permit.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={permit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg font-semibold">{permit.title}</h3>
                        <Badge variant="outline" className="w-fit">
                          {permit.id}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{permit.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{permit.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Submitted: {new Date(permit.submittedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{permit.fee}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">{permit.description}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredPermits.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No permits found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first permit application.'
              }
            </p>
            <Button onClick={() => setShowNewPermitForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Application
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Assistant Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">AI Permit Assistant</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Get help with permit requirements, form completion, and status updates. 
                Our AI assistant can guide you through the entire application process.
              </p>
              <Button variant="outline" size="sm">
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 