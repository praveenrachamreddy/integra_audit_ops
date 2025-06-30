'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store/app-store';
import { UserMenu } from '@/components/layout/user-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function DashboardNavbar() {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="mr-4 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other content can go here */}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
} 