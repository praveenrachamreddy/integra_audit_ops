'use client';

import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const { isLoading } = useAuthGuard({ requireAuth: true });

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <DashboardSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}