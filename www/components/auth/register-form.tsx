'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/store/auth-store';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading, error, clearError } = useAuthStore();

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    try {
      await register(data.email, data.firstName, data.lastName);
      setIsSubmitted(true);
    } catch (error) {
      // Error is already handled by the auth store and displayed
      console.error('Registration failed:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Check Your Email!
            </h2>
            <p className="text-muted-foreground">
              We&apos;ve sent a verification link to your email address. Please check your email and click the link to verify your account.
            </p>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Next steps:</strong> After verifying your email, you&apos;ll receive another email with instructions to set up your password.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button 
            onClick={() => setIsSubmitted(false)} 
            variant="outline" 
            className="w-full"
          >
            Register Another Account
          </Button>
          <Button 
            onClick={() => router.push('/login')} 
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              disabled={isLoading}
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              disabled={isLoading}
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            disabled={isLoading}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:text-primary/80 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            href={`/login${redirectTo !== '/dashboard' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 