'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Scan,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Clock,
  Target,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockAudits = [
  {
    id: 'AUD-2024-001',
    title: 'Q1 Environmental Compliance Audit',
    type: 'Environmental',
    status: 'completed',
    score: 87,
    riskLevel: 'low',
    completedDate: '2024-03-15',
    findings: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 8
    }
  },
  {
    id: 'AUD-2024-002',
    title: 'Safety Protocol Review',
    type: 'Safety',
    status: 'in-progress',
    score: 72,
    riskLevel: 'medium',
    startDate: '2024-03-20',
    findings: {
      critical: 1,
      high: 3,
      medium: 4,
      low: 6
    }
  },
  {
    id: 'AUD-2024-003',
    title: 'Financial Compliance Check',
    type: 'Financial',
    status: 'scheduled',
    scheduledDate: '2024-04-01',
    riskLevel: 'high'
  }
];

const complianceMetrics = [
  { label: 'Overall Compliance Score', value: 82, change: +5, trend: 'up' },
  { label: 'Critical Issues', value: 3, change: -2, trend: 'down' },
  { label: 'Audit Frequency', value: 12, change: +1, trend: 'up' },
  { label: 'Resolution Time (days)', value: 7, change: -3, trend: 'down' }
];

const riskLevels = {
  low: { color: 'bg-green-500', label: 'Low Risk', textColor: 'text-green-700' },
  medium: { color: 'bg-yellow-500', label: 'Medium Risk', textColor: 'text-yellow-700' },
  high: { color: 'bg-red-500', label: 'High Risk', textColor: 'text-red-700' }
};

const auditTypes = [
  { name: 'Environmental', icon: Shield, count: 12, color: 'text-green-600' },
  { name: 'Safety', icon: AlertTriangle, count: 8, color: 'text-yellow-600' },
  { name: 'Financial', icon: BarChart3, count: 15, color: 'text-blue-600' },
  { name: 'Operational', icon: Target, count: 6, color: 'text-purple-600' }
];

export function AuditGenieContent() {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

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
          <Button variant="outline" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Quick Scan
          </Button>
          <Button className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            New Audit
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Audit Types */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Categories</CardTitle>
              <CardDescription>Overview of different audit types and their frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {auditTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg border">
                    <type.icon className={`h-8 w-8 ${type.color}`} />
                    <div>
                      <p className="font-semibold">{type.name}</p>
                      <p className="text-sm text-muted-foreground">{type.count} audits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Current Risk Assessment</CardTitle>
              <CardDescription>Real-time compliance risk analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environmental Compliance</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Safety Protocols</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                </div>
                <Progress value={68} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Financial Compliance</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">High Risk</Badge>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          {mockAudits.map((audit, index) => {
            const riskInfo = riskLevels[audit.riskLevel as keyof typeof riskLevels];
            
            return (
              <motion.div
                key={audit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold">{audit.title}</h3>
                          <Badge variant="outline">{audit.id}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span>{audit.type} Audit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {audit.status === 'completed' && audit.completedDate && 
                                `Completed: ${new Date(audit.completedDate).toLocaleDateString()}`}
                              {audit.status === 'in-progress' && audit.startDate && 
                                `Started: ${new Date(audit.startDate).toLocaleDateString()}`}
                              {audit.status === 'scheduled' && audit.scheduledDate && 
                                `Scheduled: ${new Date(audit.scheduledDate).toLocaleDateString()}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${riskInfo.color}`} />
                            <span className={riskInfo.textColor}>{riskInfo.label}</span>
                          </div>
                        </div>
                        
                        {audit.findings && (
                          <div className="flex flex-wrap gap-2">
                            {audit.findings.critical > 0 && (
                              <Badge variant="destructive">{audit.findings.critical} Critical</Badge>
                            )}
                            {audit.findings.high > 0 && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                {audit.findings.high} High
                              </Badge>
                            )}
                            {audit.findings.medium > 0 && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {audit.findings.medium} Medium
                              </Badge>
                            )}
                            {audit.findings.low > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {audit.findings.low} Low
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                        {audit.score && (
                          <div className="text-center lg:text-right">
                            <p className="text-2xl font-bold text-primary">{audit.score}%</p>
                            <p className="text-sm text-muted-foreground">Compliance Score</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {audit.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Report
                            </Button>
                          )}
                          {audit.status === 'in-progress' && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="findings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Findings</CardTitle>
              <CardDescription>Latest compliance issues and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    severity: 'high',
                    title: 'Missing Environmental Impact Documentation',
                    description: 'Required environmental assessment documents are missing for Project Alpha.',
                    recommendation: 'Upload environmental impact study within 7 days.',
                    dueDate: '2024-04-01'
                  },
                  {
                    severity: 'medium',
                    title: 'Outdated Safety Training Records',
                    description: 'Employee safety training certificates have expired for 5 staff members.',
                    recommendation: 'Schedule renewal training sessions immediately.',
                    dueDate: '2024-03-30'
                  },
                  {
                    severity: 'low',
                    title: 'Minor Documentation Formatting Issues',
                    description: 'Some permit applications have minor formatting inconsistencies.',
                    recommendation: 'Review and standardize document templates.',
                    dueDate: '2024-04-15'
                  }
                ].map((finding, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {finding.severity === 'high' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      {finding.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      {finding.severity === 'low' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{finding.title}</h4>
                        <Badge 
                          variant={finding.severity === 'high' ? 'destructive' : 'secondary'}
                          className={
                            finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            finding.severity === 'low' ? 'bg-green-100 text-green-800' : ''
                          }
                        >
                          {finding.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                      <p className="text-sm font-medium mb-1">Recommendation: {finding.recommendation}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(finding.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and share compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Q1 2024 Compliance Summary', date: '2024-03-31', type: 'PDF', size: '2.4 MB' },
                  { name: 'Environmental Audit Report', date: '2024-03-15', type: 'PDF', size: '1.8 MB' },
                  { name: 'Safety Protocol Assessment', date: '2024-03-10', type: 'PDF', size: '3.1 MB' },
                  { name: 'Risk Analysis Dashboard', date: '2024-03-05', type: 'Excel', size: '856 KB' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.date).toLocaleDateString()} • {report.type} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 