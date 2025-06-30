'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Loader2,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  History,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store/auth-store';
import { explainApi, ExplanationResponse } from '@/lib/api/explain';
import { toast } from 'sonner';

interface QAItem {
  id: string;
  question: string;
  answer: ExplanationResponse;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are the key requirements for environmental compliance in manufacturing?",
  "How do I ensure GDPR compliance for my data processing activities?",
  "What safety protocols are required for construction sites?",
  "What are the financial reporting requirements for public companies?",
  "How do I implement proper access controls for sensitive data?",
  "What are the requirements for workplace safety training?",
];

export function QAContent() {
  const { user } = useAuthStore();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const currentQuestion = question.trim();
    setQuestion('');
    setIsLoading(true);

    try {
      const sessionId = `${user?.id}-${Date.now()}`;
      const response = await explainApi.getExplanation(currentQuestion, sessionId);
      
      const newQA: QAItem = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: response,
        timestamp: new Date(),
      };

      setQaHistory(prev => [newQA, ...prev]);
      toast.success('Question answered successfully!');
      
      // Scroll to top to show the new answer
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Failed to get explanation:', error);
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQ: string) => {
    setQuestion(suggestedQ);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearHistory = () => {
    setQaHistory([]);
    toast.success('History cleared');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Regulatory Q&A
          </h1>
          <p className="text-muted-foreground mt-1">
            Get intelligent answers to your regulatory compliance questions
          </p>
        </div>
        {qaHistory.length > 0 && (
          <Button variant="outline" onClick={clearHistory} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ask a Question
          </CardTitle>
          <CardDescription>
            Ask any regulatory compliance question and get detailed, research-backed answers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about regulatory compliance?"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Suggested Questions */}
          {qaHistory.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((suggestedQ, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 text-left justify-start text-wrap"
                    onClick={() => handleSuggestedQuestion(suggestedQ)}
                    disabled={isLoading}
                  >
                    {suggestedQ}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Q&A History */}
      {qaHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Questions & Answers ({qaHistory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea ref={scrollAreaRef} className="h-[600px] pr-4">
              <div className="space-y-6">
                {qaHistory.map((qa, index) => (
                  <motion.div
                    key={qa.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Question */}
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-primary mb-1">Question:</p>
                          <p className="text-foreground">{qa.question}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {qa.timestamp.toLocaleTimeString()}
                        </Badge>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Answer:
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(qa.answer.explanation, qa.id)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedId === qa.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {qa.answer.explanation}
                        </p>
                      </div>

                      {/* Sources */}
                      {qa.answer.sources && qa.answer.sources.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-muted-foreground">Sources:</p>
                          <div className="space-y-2">
                            {qa.answer.sources.map((source, sourceIndex) => (
                              <div
                                key={sourceIndex}
                                className="bg-background/50 rounded border p-3 space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {source.source}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {source.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {index < qaHistory.length - 1 && <Separator className="my-6" />}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {qaHistory.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              Ask your first regulatory compliance question to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 