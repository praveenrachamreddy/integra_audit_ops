'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

type VerificationState = 'loading' | 'success' | 'error' | 'invalid-token';

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setState('invalid-token');
      setMessage('No verification token provided. Please check your email for the correct link.');
      return;
    }

    // Verify the email
    const verifyEmail = async () => {
      try {
        const result = await authApi.verifyEmail({ token });
        setState('success');
        setMessage(result.message || 'Email verified successfully! Please check your email for password setup instructions.');
      } catch (error) {
        setState('error');
        setMessage(error instanceof Error ? error.message : 'Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verifying Your Email
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Check your email for password setup instructions. You&apos;ll receive a link to set up your password.
                </AlertDescription>
              </Alert>
              <Button onClick={() => router.push('/login')} className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verification Failed
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                The verification link may have expired or is invalid. Please try registering again or contact support if the problem persists.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={() => router.push('/login')} className="w-full">
                Back to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/login')} 
                className="w-full"
              >
                Register Again
              </Button>
            </div>
          </div>
        );

      case 'invalid-token':
        return (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Invalid Verification Link
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                This link appears to be invalid or incomplete. Please check your email for the correct verification link.
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/login')} className="w-full">
              Back to Login
            </Button>
          </div>
        );

      default:
        return null;
    }
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
            
            <Button variant="ghost" onClick={() => router.push('/login')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
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
              <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
              <CardDescription>
                Verifying your email address to complete registration
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 