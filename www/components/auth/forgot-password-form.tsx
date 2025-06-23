'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your API to send the reset link
    console.log(`Sending password reset link to ${email}`);
    setIsSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {isSent ? (
        <>
          <p className="text-muted-foreground mb-6">
            If an account with that email exists, a password reset link has been sent.
          </p>
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back to sign in
          </button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Send Reset Link
            </button>
            <button
              onClick={onBack}
              type="button"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Back to sign in
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
} 