'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Zap,
  FileText,
  Search,
  BookOpen,
  Lightbulb,
  Clock,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'document';
}

const quickActions = [
  {
    icon: FileText,
    title: 'Permit Requirements',
    description: 'Get permit requirements for your location',
    prompt: 'What are the permit requirements for commercial construction in San Francisco?'
  },
  {
    icon: Search,
    title: 'Regulation Lookup',
    description: 'Search specific regulations',
    prompt: 'Help me find environmental regulations for manufacturing facilities'
  },
  {
    icon: BookOpen,
    title: 'Compliance Guide',
    description: 'Step-by-step compliance guidance',
    prompt: 'Guide me through the environmental compliance process for a new facility'
  },
  {
    icon: Lightbulb,
    title: 'Best Practices',
    description: 'Industry best practices and tips',
    prompt: 'What are the best practices for maintaining regulatory compliance?'
  }
];

const sampleConversations = [
  {
    title: 'Building Permit Process',
    preview: 'What documents do I need for a commercial building permit?',
    timestamp: '2 hours ago'
  },
  {
    title: 'Environmental Compliance',
    preview: 'Help with environmental impact assessment requirements',
    timestamp: '1 day ago'
  },
  {
    title: 'Safety Regulations',
    preview: 'OSHA compliance for manufacturing facility',
    timestamp: '3 days ago'
  }
];

const mockResponses = [
  "I'd be happy to help you with that! For commercial building permits in San Francisco, you'll typically need:\n\n1. **Site Plans** - Detailed architectural drawings\n2. **Structural Engineering Reports** - Certified by a licensed engineer\n3. **Environmental Impact Assessment** - Required for buildings over 10,000 sq ft\n4. **Zoning Compliance Certificate** - Verify the project meets zoning requirements\n5. **Fire Safety Plan** - Approved by the fire department\n\nWould you like me to provide more details about any of these requirements?",
  
  "Based on current regulations, here are the key steps for environmental compliance:\n\n**Phase 1: Initial Assessment**\n- Environmental site assessment\n- Soil and water testing\n- Air quality evaluation\n\n**Phase 2: Documentation**\n- Environmental Impact Report (EIR)\n- Mitigation measures plan\n- Monitoring protocols\n\n**Phase 3: Approval Process**\n- Submit to regulatory agencies\n- Public comment period\n- Final approval and permits\n\nThe entire process typically takes 3-6 months. Would you like specific guidance on any phase?",
  
  "Here are the current best practices for regulatory compliance:\n\n✅ **Proactive Monitoring** - Regular compliance audits\n✅ **Documentation Management** - Centralized record keeping\n✅ **Staff Training** - Regular compliance education\n✅ **Technology Integration** - Automated compliance tracking\n✅ **Stakeholder Communication** - Regular updates to authorities\n\nImplementing these practices can reduce compliance issues by up to 80%. Which area would you like to focus on first?"
];

export function AssistantContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your RegOps AI Assistant. I can help you with regulatory compliance, permit applications, environmental requirements, and much more. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] max-h-[700px]">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-80 border-r border-border bg-muted/30">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversations
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <action.icon className="h-4 w-4 mr-3 flex-shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Conversations</h3>
          <div className="space-y-2">
            {sampleConversations.map((conv, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.preview}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conv.timestamp}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">RegOps AI Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  {isTyping ? 'Typing...' : 'Online • Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {message.sender === 'assistant' && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about regulations, permits, compliance..."
                className="min-h-[60px] max-h-32 resize-none pr-12"
                disabled={isTyping}
              />
              <Button
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI responses may contain errors. Always verify important information with official sources.
          </p>
        </div>
      </div>
    </div>
  );
} 