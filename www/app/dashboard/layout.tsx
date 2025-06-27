'use client';

import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const { isLoading } = useAuthGuard({ requireAuth: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-primary/10 rounded-full animate-ping"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Preparing your regulatory command center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile Navigation */}
      <MobileNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © 2024 RegOps. Powered by AI. Built for compliance excellence.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}