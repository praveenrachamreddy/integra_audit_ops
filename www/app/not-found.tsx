'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold text-foreground mb-4"
            >
              404 - Page Not Found
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8"
            >
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg"
                onClick={() => router.push('/')}
                className="flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-12 text-sm text-muted-foreground"
            >
              <p>Need help? Contact our support team.</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 