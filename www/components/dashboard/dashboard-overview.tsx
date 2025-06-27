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
  XCircle,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

const statCards = [
  {
    title: 'Active Permits',
    value: '12',
    change: '+2 from last month',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    trend: '+16.7%'
  },
  {
    title: 'Compliance Score',
    value: '94%',
    change: '+3% from last week',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
    trend: '+3.2%'
  },
  {
    title: 'Documents',
    value: '47',
    change: '+8 uploaded today',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
    trend: '+20.5%'
  },
  {
    title: 'Pending Reviews',
    value: '3',
    change: '2 due this week',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
    trend: '-25%'
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'permit',
    title: 'Building Permit #2024-001 Approved',
    description: 'Commercial construction permit for 123 Main St',
    timestamp: '2 hours ago',
    status: 'approved',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'audit',
    title: 'Environmental Audit Completed',
    description: 'Quarterly compliance audit finished with 96% score',
    timestamp: '4 hours ago',
    status: 'completed',
    icon: Shield,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'document',
    title: 'New Document Uploaded',
    description: 'Safety protocol document added to compliance folder',
    timestamp: '6 hours ago',
    status: 'uploaded',
    icon: FileText,
    color: 'text-purple-600'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Renewal Notice',
    description: 'Food service license expires in 30 days',
    timestamp: '1 day ago',
    status: 'warning',
    icon: AlertTriangle,
    color: 'text-yellow-600'
  },
];

const quickActions = [
  {
    title: 'New Permit Application',
    description: 'Start a new permit application with AI assistance',
    icon: Building2,
    href: '/dashboard/permits',
    color: 'from-blue-500 to-blue-600',
    badge: 'Popular'
  },
  {
    title: 'Run Compliance Audit',
    description: 'Perform automated compliance check with AuditGenie',
    icon: Shield,
    href: '/dashboard/audit',
    color: 'from-green-500 to-green-600',
    badge: 'New'
  },
  {
    title: 'Ask AI Assistant',
    description: 'Get regulatory guidance and compliance help',
    icon: Zap,
    href: '/dashboard/assistant',
    color: 'from-purple-500 to-purple-600',
    badge: null
  },
  {
    title: 'Upload Documents',
    description: 'Add compliance documents to your repository',
    icon: FileText,
    href: '/dashboard/documents',
    color: 'from-orange-500 to-orange-600',
    badge: null
  },
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
        duration: 0.5
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
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.first_name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your regulatory operations today.
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            onClick={() => router.push('/dashboard/permits')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to streamline your regulatory workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-3 hover:border-primary/50 group"
                    onClick={() => router.push(action.href)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      {action.badge && (
                        <Badge variant={action.badge === 'New' ? 'default' : 'secondary'} className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm group-hover:text-primary transition-colors">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your regulatory operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => router.push('/dashboard/activity')}>
                View All Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance Score Widget */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Compliance Overview
              </CardTitle>
              <CardDescription>
                Your regulatory compliance status across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Environmental', score: 96, color: 'bg-green-500' },
                  { name: 'Safety', score: 92, color: 'bg-blue-500' },
                  { name: 'Financial', score: 89, color: 'bg-purple-500' },
                  { name: 'Operational', score: 94, color: 'bg-orange-500' },
                ].map((area) => (
                  <div key={area.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{area.name}</span>
                      <span className="text-muted-foreground">{area.score}%</span>
                    </div>
                    <Progress value={area.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Activity
              </CardTitle>
              <CardDescription>
                Recent team actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', action: 'Completed audit review', time: '2h ago' },
                  { name: 'Mike Johnson', action: 'Submitted permit docs', time: '4h ago' },
                  { name: 'Lisa Wang', action: 'Updated compliance checklist', time: '6h ago' },
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs font-medium text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{member.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
} 