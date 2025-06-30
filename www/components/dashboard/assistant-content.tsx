'use client';

import { useState } from 'react';
import { Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaConversation } from './media-conversation';

export function AssistantContent() {
  const [showMediaConversation, setShowMediaConversation] = useState(false);

  // Mock permit details for media conversation
  const permitDetails = {
    project_type: "Commercial Building",
    location: "San Francisco, CA",
    description: "Modern office building with retail space",
    size: "50,000 sq ft"
  };

  if (showMediaConversation) {
    return (
      <div className="fixed inset-0 w-screen h-screen">
        <MediaConversation 
          permitDetails={permitDetails}
          onClose={() => setShowMediaConversation(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
      <div className="text-center space-y-12 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose how you'd like to connect
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => setShowMediaConversation(true)}
            className="flex items-center justify-center space-x-3 h-16 text-lg font-medium"
            size="lg"
          >
            <Video className="h-6 w-6" />
            <span>Start Video Call</span>
          </Button>
          
          <Button
            onClick={() => setShowMediaConversation(true)}
            variant="outline"
            className="flex items-center justify-center space-x-3 h-16 text-lg font-medium"
            size="lg"
          >
            <Phone className="h-6 w-6" />
            <span>Start Audio Call</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 