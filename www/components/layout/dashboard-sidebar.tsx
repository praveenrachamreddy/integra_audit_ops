'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle,
  TrendingUp,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const navigation = [
  { 
    name: 'Overview', 
    href: '/dashboard/overview', 
    icon: LayoutDashboard,
    description: 'Dashboard home',
    badge: null
  },
  { 
    name: 'Permits', 
    href: '/dashboard/permits', 
    icon: Building2,
    description: 'SmartPermit AI',
    badge: '12'
  },
  { 
    name: 'Audits', 
    href: '/dashboard/audit', 
    icon: Shield,
    description: 'AuditGenie',
    badge: 'NEW'
  },
  { 
    name: 'AI Assistant', 
    href: '/dashboard/assistant', 
    icon: MessageSquare,
    description: 'Regulatory guidance',
    badge: null
  },
  { 
    name: 'Documents', 
    href: '/dashboard/documents', 
    icon: FileText,
    description: 'File management',
    badge: '47'
  },
];

const secondaryNavigation = [
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    description: 'Account & preferences'
  },
  { 
    name: 'Help & Support', 
    href: '/dashboard/help', 
    icon: HelpCircle,
    description: 'Get assistance'
  },
];

const quickStats = [
  { label: 'Active Permits', value: '12', trend: '+2', icon: Building2, color: 'text-blue-600' },
  { label: 'Compliance Score', value: '94%', trend: '+3%', icon: Shield, color: 'text-green-600' },
  { label: 'This Month', value: '8', trend: '+5', icon: TrendingUp, color: 'text-purple-600' },
];

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-gradient-to-b from-card to-card/50 border-r border-border/50 backdrop-blur-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo & Brand */}
      <div className="flex items-center h-16 px-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RegOps</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quick Stats
          </h3>
          <div className="grid gap-3">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-3 rounded-lg bg-gradient-to-r from-background/50 to-background/30 border border-border/50 hover:border-primary/20 transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                    <div className="text-xs text-green-600">{stat.trend}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="mx-6" />

      {/* Main Navigation */}
      <nav className="flex-1 px-6 py-4 space-y-2">
        <div className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-3 group relative",
                    isActive && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'NEW' ? 'default' : 'secondary'} 
                      className="ml-2 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-r-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-2">
          {secondaryNavigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navigation.length + index) * 0.1 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3 group",
                    isActive && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                    <div className="text-left">
                      <div className="text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* AI Assistant Prompt */}
      <div className="px-6 pb-6">
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">AI Assistant</h4>
              <p className="text-xs text-muted-foreground">Ready to help</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Get instant regulatory guidance and compliance insights.
          </p>
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            onClick={() => handleNavigation('/dashboard/assistant')}
          >
            Ask AI Assistant
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 