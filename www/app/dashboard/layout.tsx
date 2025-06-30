'use client';

import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import HomepageNavbar from '@/components/layout/homepage-navbar';
import { DashboardLoading } from '@/components/ui/loading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const { isLoading } = useAuthGuard({ requireAuth: true });

  // Show loading screen while checking auth
  if (isLoading) {
    return <DashboardLoading text="Loading Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Navbar - fixed at top */}
      <div className="sticky top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <HomepageNavbar />
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}