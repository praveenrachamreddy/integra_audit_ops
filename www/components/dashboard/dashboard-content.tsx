'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  FileText, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store/app-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Import page components
import { SmartPermitContent } from '@/components/dashboard/smart-permit-content';
import { AuditGenieContent } from '@/components/dashboard/audit-genie-content';
import { AssistantContent } from '@/components/dashboard/assistant-content';
import { DocumentsContent } from '@/components/dashboard/documents-content';
import { SettingsContent } from '@/components/dashboard/settings-content';
import { HelpContent } from '@/components/dashboard/help-content';
import { NotFoundContent } from '@/components/dashboard/not-found-content';

const statCards = [
  {
    title: 'Active Permits',
    value: '12',
    change: '+2 from last month',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    title: 'Compliance Score',
    value: '94%',
    change: '+3% from last week',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    title: 'Documents',
    value: '47',
    change: '+8 uploaded today',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    title: 'Pending Reviews',
    value: '3',
    change: '2 due this week',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
    case 'compliant':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
    case 'non_compliant':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
    case 'compliant':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rejected':
    case 'non_compliant':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'under_review':
    case 'pending':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

function DashboardHomeContent() {
  const { permits, complianceChecks, setCurrentPage } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your regulatory operations.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1">
                <div 
                  className={`h-full ${stat.color.replace('text-', 'bg-')} opacity-20`}
                  style={{ width: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Permits */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Permits</CardTitle>
                  <CardDescription>
                    Latest permit applications and their status
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentPage('smart-permit')}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {permits.slice(0, 3).map((permit) => (
                <div key={permit.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {permit.title}
                      </p>
                      {getStatusIcon(permit.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {permit.type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(permit.status)}`}>
                        {permit.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{permit.progress}%</span>
                      </div>
                      <Progress value={permit.progress} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>
                    Current compliance checks and their results
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentPage('audit-genie')}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceChecks.slice(0, 3).map((check) => (
                <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {check.title}
                      </p>
                      {getStatusIcon(check.status)}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {check.type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(check.status)}`}>
                        {check.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last checked: {new Date(check.lastChecked).toLocaleDateString()}
                    </div>
                    {check.issues.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs text-red-600">
                          {check.issues.length} issue{check.issues.length > 1 ? 's' : ''} found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 h-auto p-4"
                onClick={() => setCurrentPage('smart-permit')}
              >
                <Building2 className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">New Permit</div>
                  <div className="text-xs text-muted-foreground">Start a permit application</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 h-auto p-4"
                onClick={() => setCurrentPage('audit-genie')}
              >
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Run Audit</div>
                  <div className="text-xs text-muted-foreground">Check compliance status</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 h-auto p-4"
                onClick={() => setCurrentPage('assistant')}
              >
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Get Help</div>
                  <div className="text-xs text-muted-foreground">Ask AI assistant</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function DashboardContent() {
  const { currentPage } = useAppStore();

  // Render content based on current page
  switch (currentPage) {
    case 'dashboard':
      return <DashboardHomeContent />;
    case 'smart-permit':
      return <SmartPermitContent />;
    case 'audit-genie':
      return <AuditGenieContent />;
    case 'assistant':
      return <AssistantContent />;
    case 'documents':
      return <DocumentsContent />;
    case 'settings':
      return <SettingsContent />;
    case 'help':
      return <HelpContent />;
    default:
      return <NotFoundContent />;
  }
}