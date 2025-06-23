'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DocumentsContent() {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Document Management
          </h1>
          <p className="text-muted-foreground">
            Organize, store, and manage all your regulatory documents.
          </p>
        </div>
        <Button size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Document Library
            </CardTitle>
            <CardDescription>
              Centralized storage for all your regulatory documents and files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Document Management
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This feature is coming soon! You&apos;ll be able to upload, organize, and manage 
                all your regulatory documents in one secure location.
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload First Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 