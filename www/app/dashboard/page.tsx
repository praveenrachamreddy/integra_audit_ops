'use client';

import * as React from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { useAppStore } from '@/lib/store/app-store';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { sidebarOpen } = useAppStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <MobileNav />
      
      <main 
        id="main-content"
        className={cn(
          "transition-all duration-200 ease-in-out",
          "md:ml-80", // Default desktop margin
          !sidebarOpen && "md:ml-20" // Collapsed sidebar margin
        )}
      >
        <div className="p-6 md:p-8">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}