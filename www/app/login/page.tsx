'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function LoginPage() {
  const [formMode, setFormMode] = React.useState<'login' | 'signup' | 'forgot-password'>('login');
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  const renderForm = () => {
    switch (formMode) {
      case 'login':
        return (
          <LoginForm
            onToggleMode={() => setFormMode('signup')}
            onForgotPassword={() => setFormMode('forgot-password')}
          />
        );
      case 'signup':
        return <SignupForm onToggleMode={() => setFormMode('login')} />;
      case 'forgot-password':
        return <ForgotPasswordForm onBack={() => setFormMode('login')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">RegOps Platform</h1>
              <p className="text-muted-foreground">Regulatory Operations Made Simple</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              AI-Powered Regulatory Compliance
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-foreground">SmartPermit</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-driven permit application workflow with jurisdiction-specific forms
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-foreground">AuditGenie</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time compliance checking with automated PDF reports
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-foreground">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive chat interface for regulatory guidance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg">
            <blockquote className="text-muted-foreground italic">
              "RegOps has transformed how we handle regulatory compliance. 
              What used to take weeks now takes days."
            </blockquote>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Jane Smith</p>
                <p className="text-xs text-muted-foreground">Compliance Manager, TechCorp</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-2xl p-8 lg:p-12"
        >
          {renderForm()}
        </motion.div>
      </div>
    </div>
  );
}