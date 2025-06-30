'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';

const features = [
  {
    title: 'Compliance Auditing',
    description: 'AI-powered compliance audits',
    icon: Shield,
    action: 'audit',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    badge: 'AI-Powered'
  },
  {
    title: 'AI Assistant',
    description: 'Audio and video conversations',
    icon: MessageSquare,
    action: 'assistant',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    badge: 'Beta'
  }
];

const recentActivity = [
  {
    id: 1,
    title: 'Welcome to RegOps',
    type: 'system',
    time: '2 hours ago',
    description: 'Get started with AI-powered regulatory operations'
  }
];

interface SimplifiedDashboardProps {
  onNavigate: (page: string) => void;
}

export function SimplifiedDashboard({ onNavigate }: SimplifiedDashboardProps) {
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
      className="space-y-8 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to RegOps, {user?.first_name || 'there'}! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered regulatory operations platform. Get started with compliance auditing and intelligent assistance.
          </p>
        </div>
      </motion.div>

      {/* Main Features */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Main Features</CardTitle>
            <CardDescription>Choose your preferred way to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature) => (
              <Button
                key={feature.title}
                variant="outline"
                className="h-auto p-6 flex items-center justify-between w-full group hover:border-primary/50"
                onClick={() => onNavigate(feature.action)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${feature.bgColor} group-hover:bg-primary/10`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      {feature.title}
                      {feature.badge && (
                        <Badge variant="secondary">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your regulatory operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Access */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Access tools and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate('documents')}
              >
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Documents</div>
                  <div className="text-xs text-muted-foreground">Manage files</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate('settings')}
              >
                <Settings className="h-8 w-8 text-gray-600" />
                <div className="text-center">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Configure preferences</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate('help')}
              >
                <HelpCircle className="h-8 w-8 text-indigo-600" />
                <div className="text-center">
                  <div className="font-medium">Help</div>
                  <div className="text-xs text-muted-foreground">Get support</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 