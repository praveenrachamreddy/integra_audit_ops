'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { signup, isLoading, error } = useAuthStore();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      location: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: SignupForm) => {
    signup({
      fullName: data.fullName,
      email: data.email,
      company: data.company,
      location: data.location,
      role: 'user',
      password: data.password,
    }).catch(() => {
        // The store now handles the error state, so we just need to catch the promise rejection
        // to prevent an unhandled promise rejection warning.
        // The error message will be displayed via the 'error' state from the store.
    })
  };

  React.useEffect(() => {
    if(error){
      toast.error(error);
    }
  }, [error]);

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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="mt-1"
              {...form.register('fullName')}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Company name"
                className="mt-1"
                {...form.register('company')}
              />
              {form.formState.errors.company && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="City, State"
                className="mt-1"
                {...form.register('location')}
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
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

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={form.watch('agreeToTerms')}
            onCheckedChange={(checked) => 
              form.setValue('agreeToTerms', !!checked)
            }
            className="mt-1"
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

        {error && !form.formState.isSubmitting && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating account...' : 'Create account'}
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