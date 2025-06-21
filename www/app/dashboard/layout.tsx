'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DashboardNavbar } from '@/components/layout/dashboard-navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation - Shows on small screens */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      <div className="lg:flex lg:h-screen">
        {/* Desktop Sidebar - Shows on large screens */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <AppSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:flex lg:flex-col lg:overflow-hidden">
          {/* Desktop Navbar - Shows on large screens */}
          <div className="hidden lg:block">
            <DashboardNavbar />
          </div>

          {/* Page Content with uniform padding */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}