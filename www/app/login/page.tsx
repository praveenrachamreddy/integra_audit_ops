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

function LoginPageContent() {
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, initialize } = useAuthStore();

  const tab = searchParams.get('tab');
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RegOps</span>
            </Link>
            
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'login' 
                  ? 'Sign in to your RegOps account' 
                  : 'Get started with RegOps today'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-0">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="register" className="space-y-0">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {redirectTo !== '/dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                You&apos;ll be redirected to your requested page after signing in.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 RegOps. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}