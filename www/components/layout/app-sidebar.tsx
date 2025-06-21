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
  User,
  LogOut
} from 'lucide-react';
import { useAppStore } from '@/lib/store/app-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', page: 'dashboard' as const, icon: LayoutDashboard },
  { name: 'SmartPermit', page: 'smart-permit' as const, icon: Building2 },
  { name: 'AuditGenie', page: 'audit-genie' as const, icon: Shield },
  { name: 'AI Assistant', page: 'assistant' as const, icon: MessageSquare },
  { name: 'Documents', page: 'documents' as const, icon: FileText },
];

const secondaryNavigation = [
  { name: 'Settings', page: 'settings' as const, icon: Settings },
  { name: 'Help & Support', page: 'help' as const, icon: HelpCircle },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { currentPage, setCurrentPage } = useAppStore();
  const { user, logout } = useAuthStore();

  const getUserInitials = (user: any) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const getUserFullName = (user: any) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">RegOps</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 h-11",
                isActive && "bg-secondary text-secondary-foreground"
              )}
              onClick={() => setCurrentPage(item.page)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          );
        })}

        <Separator className="my-4" />

        {secondaryNavigation.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 h-11",
                isActive && "bg-secondary text-secondary-foreground"
              )}
              onClick={() => setCurrentPage(item.page)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Built with{' '}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Bolt.new
          </a>
        </p>
      </div>
    </div>
  );
}