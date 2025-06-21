'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SettingsContent() {
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

  const settingsCategories = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and account details',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alerts and notification preferences',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Password, two-factor authentication, and security settings',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme, display preferences, and customization options',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
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
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      {/* Settings Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category) => (
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
            <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Settings Panel
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This feature is coming soon! You'll be able to customize your account settings, 
              notifications, security preferences, and more.
            </p>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 