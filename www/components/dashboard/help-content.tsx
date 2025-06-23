'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageCircle, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HelpContent() {
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

  const helpCategories = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and API documentation',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we&apos;ll get back to you',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our support hotline for urgent issues',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Help & Support
        </h1>
        <p className="text-muted-foreground">
          Get help with RegOps platform and regulatory compliance questions.
        </p>
      </motion.div>

      {/* Help Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category) => (
          <Card key={category.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </motion.div>

      {/* Coming Soon Notice */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Help Center
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This feature is coming soon! You&apos;ll have access to comprehensive documentation, 
              live chat support, and direct contact with our regulatory experts.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <p>• Knowledge base and tutorials</p>
              <p>• Video guides and walkthroughs</p>
              <p>• Community forums</p>
              <p>• Expert regulatory consultation</p>
            </div>
            <Button variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 