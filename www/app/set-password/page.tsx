'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;
type SetPasswordState = 'form' | 'loading' | 'success' | 'error' | 'invalid-token';

export default function SetPasswordPage() {
  const [state, setState] = useState<SetPasswordState>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const urlToken = searchParams.get('token');
    
    if (!urlToken) {
      setState('invalid-token');
      setMessage('No password setup token provided. Please check your email for the correct link.');
      return;
    }

    setToken(urlToken);
  }, [searchParams]);

  const onSubmit = async (data: PasswordForm) => {
    if (!token) return;
    
    setState('loading');
    try {
      const result = await authApi.setPassword({ 
        token, 
        password: data.password 
      });
      setState('success');
      setMessage(result.message || 'Password set successfully! You can now log in.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Failed to set password. Please try again.');
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'form':
        return (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="pr-10"
                    {...form.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className="pr-10"
                    {...form.register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Password requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={!token}>
              <Lock className="mr-2 h-4 w-4" />
              Set Password
            </Button>
          </form>
        );

      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Setting Your Password
            </h2>
            <p className="text-muted-foreground">
              Please wait while we set up your password...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Password Set Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account is now fully set up! You can log in with your email and password.
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Failed to Set Password
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                The password setup link may have expired or is invalid. Please contact support or try the registration process again.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={() => setState('form')} className="w-full">
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/login')} 
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        );

      case 'invalid-token':
        return (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Invalid Setup Link
            </h2>
            <p className="text-muted-foreground mb-6">
              {message}
            </p>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                This link appears to be invalid or incomplete. Please check your email for the correct password setup link.
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
              <CardTitle className="text-2xl font-bold">Set Your Password</CardTitle>
              <CardDescription>
                Create a secure password to complete your account setup
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