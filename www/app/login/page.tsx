'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/store/auth-store';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import Link from 'next/link';
import HomepageNavbar from '@/components/layout/homepage-navbar';
import { FullScreenLoading } from '@/components/ui/loading';

function LoginPageContent() {
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, initialize } = useAuthStore();

  const tab = searchParams.get('tab');
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  useEffect(() => {
    // Initialize auth state on component mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Set active tab based on URL parameter
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [tab]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push(decodeURIComponent(redirectTo));
    }
  }, [isAuthenticated, redirectTo, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const currentUrl = new URL(window.location.href);
    if (value === 'register') {
      currentUrl.searchParams.set('tab', 'register');
    } else {
      currentUrl.searchParams.delete('tab');
    }
    router.replace(currentUrl.pathname + currentUrl.search);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <HomepageNavbar />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to RegOps</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<FullScreenLoading text="Loading Authentication" />}>
      <LoginPageContent />
    </Suspense>
  );
}