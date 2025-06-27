'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    clearError();
    try {
      await register(data.email, data.firstName, data.lastName);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto text-center space-y-6"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
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
            onClick={onToggleMode} 
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Join RegOps and streamline your regulatory operations
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                className="mt-1"
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
                placeholder="Last name"
                className="mt-1"
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
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              disabled={isLoading}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={form.watch('agreeToTerms')}
            onCheckedChange={(checked) => 
              form.setValue('agreeToTerms', !!checked)
            }
            className="mt-1"
            disabled={isLoading}
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
          >
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
        {form.formState.errors.agreeToTerms && (
          <p className="text-sm text-destructive">
            {form.formState.errors.agreeToTerms.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="px-0" onClick={onToggleMode}>
            Sign in
          </Button>
        </p>
      </div>
    </motion.div>
  );
}