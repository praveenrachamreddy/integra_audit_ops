import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '../api/auth';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { 
    requireAuth = true, 
    redirectTo = '/login' 
  } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading && authApi.isLoggedIn()) {
      initialize();
    }
  }, [isAuthenticated, isLoading, initialize]);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // If auth is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const currentPath = pathname + window.location.search;
      const encodedRedirect = encodeURIComponent(currentPath);
      router.push(`${redirectTo}?redirectTo=${encodedRedirect}`);
      return;
    }

    // If user is authenticated but trying to access auth pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/verify-email' || pathname === '/set-password')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, requireAuth, pathname, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    isProtected: requireAuth,
  };
} 