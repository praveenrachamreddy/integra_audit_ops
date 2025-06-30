'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  MessageSquare,
  Settings,
  HelpCircle,
  Plus,
  ChevronRight,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store/auth-store';
import { AuditGenieContent } from '@/components/dashboard/audit-genie-content';
import { AssistantContent } from '@/components/dashboard/assistant-content';
import { DocumentsContent } from '@/components/dashboard/documents-content';
import { SettingsContent } from '@/components/dashboard/settings-content';
import { HelpContent } from '@/components/dashboard/help-content';

const quickActions = [
  {
    title: 'Run Audit',
    description: 'AI-powered compliance auditing',
    icon: Shield,
    action: 'audit',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'AI Assistant',
    description: 'Get intelligent help',
    icon: MessageSquare,
    action: 'assistant',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    title: 'Documents',
    description: 'Manage regulatory documents',
    icon: FileText,
    action: 'documents',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900'
  }
];

export function DashboardContent() {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('overview');

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  // Route to different content based on current page
  switch (currentPage) {
    case 'audit':
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
      break;
  }

  return (
    <motion.div 
      className="space-y-8 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.first_name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your regulatory operations today.
            </p>
          </div>
          <Button 
            onClick={() => setCurrentPage('audit')}
            size="lg"
            className="sm:w-auto"
          >
            <Shield className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex items-center justify-between w-full group hover:border-primary/50"
                onClick={() => setCurrentPage(action.action)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors ${action.bgColor} group-hover:bg-primary/10`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tools & Resources */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Tools & Resources</CardTitle>
            <CardDescription>Access additional features and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center justify-between w-full group hover:border-primary/50"
              onClick={() => setCurrentPage('settings')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-sm text-muted-foreground">Configure your preferences</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center justify-between w-full group hover:border-primary/50"
              onClick={() => setCurrentPage('help')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg transition-colors bg-indigo-100 dark:bg-indigo-900 group-hover:bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Help & Support</div>
                  <div className="text-sm text-muted-foreground">Get assistance when needed</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Getting Started */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Get Started with RegOps</CardTitle>
            <CardDescription>AI-powered regulatory operations made simple</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4">
                <Shield className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Compliance Auditing</h3>
                <p className="text-sm text-muted-foreground">Run AI-powered compliance audits with detailed reports and recommendations</p>
              </div>
              <div className="p-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Get intelligent help with audio and video conversations</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setCurrentPage('audit')} size="lg">
                <Shield className="h-4 w-4 mr-2" />
                Start First Audit
              </Button>
              <Button onClick={() => setCurrentPage('assistant')} variant="outline" size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}