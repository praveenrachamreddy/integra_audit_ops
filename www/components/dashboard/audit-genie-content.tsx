'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Scan,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Zap,
  Clock,
  Target,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { auditApi } from '@/lib/api/audit';
import { toast } from 'sonner';

interface AuditRun {
  audit_id: string;
  company_name: string;
  run_date: string;
  score: number;
  pdf_url: string;
}

const auditTypes = [
  { value: 'environmental', label: 'Environmental Compliance', description: 'Environmental impact and regulations' },
  { value: 'safety', label: 'Safety Protocols', description: 'Workplace safety and health standards' },
  { value: 'financial', label: 'Financial Compliance', description: 'Financial regulations and reporting' },
  { value: 'operational', label: 'Operational Audit', description: 'Business operations and processes' },
  { value: 'general', label: 'General Compliance', description: 'Comprehensive compliance review' }
];

const controlFamilies = [
  'Access Control',
  'Asset Management', 
  'Business Continuity',
  'Compliance',
  'Data Protection',
  'Environmental',
  'Financial Controls',
  'Human Resources',
  'Information Security',
  'Operational Controls',
  'Risk Management',
  'Safety Protocols'
];

export function AuditGenieContent() {
  const { user } = useAuthStore();
  const [isRunning, setIsRunning] = useState(false);
  const [auditHistory, setAuditHistory] = useState<AuditRun[]>([]);
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    audit_type: '',
    company_name: '',
    audit_scope: '',
    control_families: [] as string[]
  });

  // Load audit history on mount
  useEffect(() => {
    loadAuditHistory();
  }, []);

  const loadAuditHistory = async () => {
    if (!user?.id) return;
    
    setIsLoadingHistory(true);
    try {
      const response = await auditApi.getAuditHistory(user.id.toString());
      setAuditHistory(response.history || []);
    } catch (error) {
      console.error('Failed to load audit history:', error);
      toast.error('Failed to load audit history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleControlFamilyToggle = useCallback((family: string) => {
    setFormData(prev => ({
      ...prev,
      control_families: prev.control_families.includes(family)
        ? prev.control_families.filter(f => f !== family)
        : [...prev.control_families, family]
    }));
  }, []);

  const runAudit = useCallback(async () => {
    if (!formData.audit_type || !formData.company_name || !formData.audit_scope || formData.control_families.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    setIsRunning(true);
    
    try {
      const auditRequest = {
        audit_details: {
          company_name: formData.company_name,
          audit_scope: formData.audit_scope,
          control_families: formData.control_families
        },
        audit_type: formData.audit_type
      };

      const result = await auditApi.runAudit(auditRequest, selectedFiles);
      
      toast.success('Audit completed successfully!');
      
      // Reload history to get the latest audit
      await loadAuditHistory();
      
      setShowNewAudit(false);
      
      // Reset form
      setFormData({
        audit_type: '',
        company_name: '',
        audit_scope: '',
        control_families: []
      });
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error('Audit failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  }, [formData, selectedFiles, loadAuditHistory]);

  const downloadReport = useCallback(async (pdfUrl: string, companyName: string) => {
    try {
      const fileId = pdfUrl.replace('/api/v1/audit/pdf/', '');
      const blob = await auditApi.downloadPdf(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download report');
    }
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            AuditGenie
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered compliance auditing and risk assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewAudit} onOpenChange={setShowNewAudit}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Audit</DialogTitle>
                <DialogDescription>
                  Configure your compliance audit parameters and upload relevant documents.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audit_type">Audit Type *</Label>
                    <Select value={formData.audit_type} onValueChange={(value) => setFormData(prev => ({ ...prev, audit_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {auditTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit_scope">Audit Scope *</Label>
                  <Textarea
                    id="audit_scope"
                    value={formData.audit_scope}
                    onChange={(e) => setFormData(prev => ({ ...prev, audit_scope: e.target.value }))}
                    placeholder="Describe the scope and objectives of this audit..."
                    rows={3}
                  />
                </div>

                {/* Control Families */}
                <div className="space-y-2">
                  <Label>Control Families * (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                    {controlFamilies.map((family) => (
                      <label key={family} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.control_families.includes(family)}
                          onChange={() => handleControlFamilyToggle(family)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{family}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Documents * (Upload compliance documents)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT files</p>
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files ({selectedFiles.length})</Label>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewAudit(false)}>
                    Cancel
                  </Button>
                  <Button onClick={runAudit} disabled={isRunning}>
                    {isRunning && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    {isRunning ? 'Running Audit...' : 'Run Audit'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Audit History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                    <p className="text-2xl font-bold">{auditHistory.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">
                      {auditHistory.length > 0 
                        ? Math.round(auditHistory.reduce((acc, audit) => acc + audit.score, 0) / auditHistory.length)
                        : 0}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">
                      {auditHistory.filter(audit => 
                        new Date(audit.run_date).getMonth() === new Date().getMonth()
                      ).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          {auditHistory.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started with AuditGenie</CardTitle>
                <CardDescription>Run your first compliance audit in minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">1. Upload Documents</h3>
                    <p className="text-sm text-muted-foreground">Upload your compliance documents and policies</p>
                  </div>
                  <div className="text-center p-4">
                    <Scan className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">2. Configure Audit</h3>
                    <p className="text-sm text-muted-foreground">Select audit type and control families</p>
                  </div>
                  <div className="text-center p-4">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">3. Get Results</h3>
                    <p className="text-sm text-muted-foreground">Receive detailed audit report with recommendations</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button onClick={() => setShowNewAudit(true)} size="lg">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Your First Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {isLoadingHistory ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                <p>Loading audit history...</p>
              </CardContent>
            </Card>
          ) : auditHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
                <p className="text-muted-foreground mb-4">Run your first audit to see results here</p>
                <Button onClick={() => setShowNewAudit(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Audit
                </Button>
              </CardContent>
            </Card>
          ) : (
            auditHistory.map((audit, index) => (
              <motion.div
                key={audit.audit_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold">{audit.company_name}</h3>
                          <Badge variant="default">Completed</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(audit.run_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                        <div className="text-center lg:text-right">
                          <p className="text-2xl font-bold text-primary">{audit.score}%</p>
                          <p className="text-sm text-muted-foreground">Compliance Score</p>
                        </div>
                        
                        {audit.pdf_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadReport(audit.pdf_url, audit.company_name)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and share compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              {auditHistory.filter(audit => audit.pdf_url).length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reports available</h3>
                  <p className="text-muted-foreground">Complete an audit to generate downloadable reports</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditHistory
                    .filter(audit => audit.pdf_url)
                    .map((audit) => (
                      <div key={audit.audit_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-semibold">{audit.company_name} Compliance Audit</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(audit.run_date).toLocaleDateString()} • PDF • Score: {audit.score}%
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(audit.pdf_url, audit.company_name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 