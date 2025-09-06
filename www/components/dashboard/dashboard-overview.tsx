'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  FileText, 
  Clock,
  Plus,
  Phone,
  Brain,
  Settings,
  HelpCircle,
  ChevronRight,
  FolderOpen,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    title: 'Run Audit',
    description: 'Check compliance status',
    icon: Shield,
    href: '/dashboard/audit',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    badge: 'AI-Powered'
  },
  {
    title: 'AI Assistant',
    description: 'Get intelligent help',
    icon: Phone,
    href: '/dashboard/assistant',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    badge: 'Beta'
  },
  {
    title: 'Projects',
    description: 'Manage client projects',
    icon: FolderOpen,
    href: '/dashboard/projects',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    badge: 'New'
  }
];

const tools = [
  {
    title: 'Documents',
    description: 'Manage your regulatory documents',
    icon: FileText,
    href: '/dashboard/documents',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900'
  },
  {
    title: 'Project Reports',
    description: 'View project analytics',
    icon: BarChart3,
    href: '/dashboard/projects',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900'
  },
  {
    title: 'Settings',
    description: 'Configure your preferences',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  }
];

export function DashboardOverview() {
  const router = useRouter();
  const { user } = useAuthStore();

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

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.first_name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your projects and compliance today.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/audit')}
            size="lg"
            className="sm:w-auto"
          >
            <Shield className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions and Tools */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto p-4 flex items-center justify-between w-full group hover:border-primary/50"
                    onClick={() => router.push(action.href)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg transition-colors", action.bgColor, "group-hover:bg-primary/10")}>
                        <action.icon className={cn("h-5 w-5", action.color)} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium flex items-center gap-2">
                          {action.title}
                          {action.badge && (
                            <Badge variant="secondary" className="ml-2">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tools */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Tools & Resources</CardTitle>
              <CardDescription>Access your regulatory tools</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <Button
                    key={tool.title}
                    variant="outline"
                    className="h-auto p-4 flex items-center justify-between w-full group hover:border-primary/50"
                    onClick={() => router.push(tool.href)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg transition-colors", tool.bgColor, "group-hover:bg-primary/10")}>
                        <tool.icon className={cn("h-5 w-5", tool.color)} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{tool.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
                <FolderOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Project Management</h3>
                <p className="text-sm text-muted-foreground">Track multiple client projects with timeline and budget monitoring</p>
              </div>
              <div className="p-4">
                <Phone className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Get intelligent help with audio and video conversations</p>
              </div>
              <div className="p-4">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Analytics & Reporting</h3>
                <p className="text-sm text-muted-foreground">Gain insights with project and compliance analytics</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/dashboard/audit')} size="lg">
                <Shield className="h-4 w-4 mr-2" />
                Start First Audit
              </Button>
              <Button onClick={() => router.push('/dashboard/assistant')} variant="outline" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}