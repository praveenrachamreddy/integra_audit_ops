'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  FileText, 
  Clock,
  Plus,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
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
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-lg group-hover:bg-accent/50 transition-colors duration-200" />
                  <button
                    onClick={() => router.push(action.href)}
                    className="relative w-full p-4 flex flex-col min-h-[140px]"
                  >
                    <div className="flex items-center justify-between w-full gap-3 mb-3">
                      <div className={`flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      {action.badge && (
                        <Badge 
                          variant={action.badge === 'New' ? 'default' : 'secondary'} 
                          className="flex-shrink-0 text-xs group-hover:bg-background/80"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-grow min-h-0 w-full">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 line-clamp-2 mt-1">
                        {action.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground/60">Click to view</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}