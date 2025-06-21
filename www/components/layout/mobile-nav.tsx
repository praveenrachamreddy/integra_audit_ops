'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { useAppStore } from '@/lib/store/app-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentPage, setCurrentPage } = useAppStore();
  const { user, logout } = useAuthStore();

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page as any);
    setIsOpen(false);
  };

  const getUserInitials = (user: any) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const getUserFullName = (user: any) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  return (
    <>
      {/* Mobile Header - Fixed at top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">RegOps</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Mobile Content Spacer */}
      <div className="lg:hidden h-16" />

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-card border-r border-border shadow-lg"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground">RegOps</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                {/* User Profile - Only show on mobile */}
                {user && (
                  <div className="p-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {getUserFullName(user)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start space-x-3 h-11"
                        onClick={() => handleNavigation(item.page)}
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
                        className="w-full justify-start space-x-3 h-11"
                        onClick={() => handleNavigation(item.page)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Button>
                    );
                  })}

                  <Separator className="my-4" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-destructive hover:text-destructive h-11"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </Button>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}