'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'SmartPermit', href: '/smart-permit', icon: Building2 },
  { name: 'AuditGenie', href: '/audit-genie', icon: Shield },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Documents', href: '/documents', icon: FileText },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { sidebarOpen, setSidebarOpen, currentPage, setCurrentPage } = useAppStore();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const sidebarVariants = {
    open: { width: '280px' },
    closed: { width: '80px' }
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border",
        className
      )}
      variants={sidebarVariants}
      animate={sidebarOpen ? "open" : "closed"}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <motion.div
            variants={contentVariants}
            animate={sidebarOpen ? "open" : "closed"}
            transition={{ duration: 0.2, delay: sidebarOpen ? 0.1 : 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold text-foreground">RegOps</span>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start space-x-3 h-auto p-3",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    variants={contentVariants}
                    animate={sidebarOpen ? "open" : "closed"}
                    className="flex flex-col items-start text-left"
                  >
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium text-foreground">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </>
                    )}
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.name} passHref>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3",
                    !sidebarOpen && "justify-center px-2",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <motion.span
                    variants={contentVariants}
                    animate={sidebarOpen ? "open" : "closed"}
                    className="text-sm"
                  >
                    {sidebarOpen && item.name}
                  </motion.span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Secondary Navigation */}
        <nav className="px-4 py-4 space-y-2">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.name} passHref>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <motion.span
                    variants={contentVariants}
                    animate={sidebarOpen ? "open" : "closed"}
                    className="text-sm"
                  >
                    {sidebarOpen && item.name}
                  </motion.span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <motion.div
            variants={contentVariants}
            animate={sidebarOpen ? "open" : "closed"}
            className="text-center"
          >
            {sidebarOpen && (
              <p className="text-xs text-muted-foreground">
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
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}