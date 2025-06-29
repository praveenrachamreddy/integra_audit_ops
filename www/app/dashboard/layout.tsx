'use client';

import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import HomepageNavbar from '@/components/layout/homepage-navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DashboardLoading } from '@/components/ui/loading';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const { isLoading } = useAuthGuard({ requireAuth: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading screen while checking auth
  if (isLoading) {
    return <DashboardLoading text="Loading Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Unified Navbar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <HomepageNavbar />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:top-16 lg:bottom-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="pt-16 lg:pl-72">
        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem-64px)]">
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
                © 2024 RegOps. Powered by Bolt.new. Built for compliance excellence.
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