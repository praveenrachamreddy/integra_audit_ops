'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  FileText, 
  Clock,
  Plus,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const statCards = [
  {
    title: 'Active Permits',
    value: '12',
    change: '+2 from last month',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    trend: '+16.7%',
    href: '/dashboard/permits'
  },
  {
    title: 'Compliance Score',
    value: '94%',
    change: '+3% from last week',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    trend: '+3.2%',
    href: '/dashboard/audit'
  },
  {
    title: 'Documents',
    value: '47',
    change: '+8 uploaded today',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    trend: '+20.5%',
    href: '/dashboard/documents'
  },
  {
    title: 'Pending Reviews',
    value: '3',
    change: '2 due this week',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    trend: '-25%',
    href: '/dashboard/permits?filter=pending'
  },
];

const quickActions = [
  {
    title: 'New Permit',
    description: 'Start a permit application',
    icon: Building2,
    href: '/dashboard/permits/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    badge: 'New'
  },
  {
    title: 'Run Audit',
    description: 'Check compliance status',
    icon: Shield,
    href: '/dashboard/audit/new',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'AI Assistant',
    description: 'Get intelligent help',
    icon: MessageSquare,
    href: '/dashboard/assistant',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    badge: 'Beta'
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
    title: 'Settings',
    description: 'Configure your preferences',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
  {
    title: 'Help & Support',
    description: 'Get assistance when needed',
    icon: HelpCircle,
    href: '/dashboard/help',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900'
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
              Here's what's happening with your regulatory operations today.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/permits/new')}
            size="lg"
            className="sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Permit
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card 
              key={stat.title} 
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
                "after:absolute after:inset-0 after:z-10 after:bg-gradient-to-r after:from-white/0 after:to-white/20 dark:after:to-white/[0.03] after:opacity-0 hover:after:opacity-100 after:transition-opacity"
              )}
              onClick={() => router.push(stat.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <span className={cn(
                        "text-xs font-medium",
                        stat.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </motion.div>
  );
}