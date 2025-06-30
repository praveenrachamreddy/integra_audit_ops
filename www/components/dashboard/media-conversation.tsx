'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { mediaApi, StartVideoConversationRequest, StartAudioConversationRequest } from '@/lib/api/media';

interface MediaConversationProps {
  permitDetails?: Record<string, any>;
  onClose?: () => void;
}

const CONVERSATION_STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

type ConversationState = typeof CONVERSATION_STATES[keyof typeof CONVERSATION_STATES];
type ConversationType = 'video' | 'audio' | null;

export function MediaConversation({ permitDetails = {}, onClose }: MediaConversationProps) {
  const [conversationType, setConversationType] = useState<ConversationType>(null);
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Video conversation state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Audio conversation state
  const [audioConfig, setAudioConfig] = useState<{ agent_id: string; prompt: string } | null>(null);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const startVideoConversation = async () => {
    setConversationState('connecting');
    setError(null);
    
    try {
      const request: StartVideoConversationRequest = {
        permit_details: permitDetails
      };
      
      const response = await mediaApi.startVideoConversation(request);
      setVideoUrl(response.conversation_url);
      setConversationType('video');
      setConversationState('connected');
      toast.success('Video conversation started successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start video conversation';
      setError(errorMessage);
      setConversationState('error');
      toast.error(errorMessage);
    }
  };

  const startAudioConversation = async () => {
    setConversationState('connecting');
    setError(null);
    
    try {
      const request: StartAudioConversationRequest = {
        permit_details: permitDetails
      };
      
      const response = await mediaApi.startAudioConversation(request);
      setAudioConfig(response);
      setConversationType('audio');
      setConversationState('connected');
      toast.success('Audio conversation ready!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start audio conversation';
      setError(errorMessage);
      setConversationState('error');
      toast.error(errorMessage);
    }
  };

  const endConversation = () => {
    setConversationType(null);
    setConversationState('idle');
    setVideoUrl(null);
    setAudioConfig(null);
    setError(null);
    setIsVideoMuted(false);
    setIsAudioMuted(false);
    setIsSpeakerMuted(false);
    
    toast.success('Conversation ended');
  };

  return (
    <div 
      ref={containerRef}
      className={`w-screen h-screen flex items-center justify-center ${isFullScreen ? 'fixed inset-0 bg-black z-50' : ''}`}
    >
      <div className="w-full h-full relative overflow-hidden">
        {/* Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-10 w-10 bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {/* Status Badge */}
        {conversationState === 'connected' && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-green-500/90 text-white border-0">
              <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
              {conversationType === 'video' ? 'Video Call Active' : 'Audio Call Active'}
            </Badge>
          </div>
        )}

        {/* Conversation Type Selection */}
        {conversationType === null && conversationState === 'idle' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center space-y-8 max-w-md mx-auto px-4">
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
                  onClick={startVideoConversation}
                  disabled={conversationState !== 'idle'}
                  className="flex items-center justify-center space-x-3 h-16 text-lg font-medium"
                  size="lg"
                >
                  <Video className="h-6 w-6" />
                  <span>Start Video Call</span>
                </Button>
                
                <Button
                  onClick={startAudioConversation}
                  disabled={conversationState !== 'idle'}
                  variant="outline"
                  className="flex items-center justify-center space-x-3 h-16 text-lg font-medium"
                  size="lg"
                >
                  <Mic className="h-6 w-6" />
                  <span>Start Audio Call</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {conversationState === 'connecting' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Connecting...</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {conversationType === 'video' ? 'Preparing video call' : 'Initializing audio call'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {conversationState === 'error' && error && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <Alert variant="destructive" className="max-w-md mx-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Video Conversation */}
        {conversationType === 'video' && videoUrl && conversationState === 'connected' && (
          <div className="w-full h-full relative bg-black">
            <iframe
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
            
            {/* Video controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-full px-8 py-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="h-12 w-12 text-white hover:bg-white/20 rounded-full"
              >
                {isVideoMuted ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="h-12 w-12 text-white hover:bg-white/20 rounded-full"
              >
                {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className="h-12 w-12 text-white hover:bg-white/20 rounded-full"
              >
                {isSpeakerMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              
              <Separator orientation="vertical" className="h-8 bg-white/30" />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                className="h-12 w-12 text-white hover:bg-white/20 rounded-full"
              >
                {isFullScreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={endConversation}
                className="h-12 w-12 text-red-400 hover:bg-red-500/20 rounded-full"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Audio Conversation */}
        {conversationType === 'audio' && conversationState === 'connected' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20">
            <div className="text-center space-y-12 px-4">
              <div className="space-y-6">
                <div className="w-40 h-40 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/30">
                  <Mic className="h-16 w-16 text-green-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Audio Call Active
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Speaking with AI assistant
                  </p>
                </div>
              </div>

              {/* Audio controls */}
              <div className="flex items-center space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="h-16 w-16 rounded-full border-2"
                >
                  {isAudioMuted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                  className="h-16 w-16 rounded-full border-2"
                >
                  {isSpeakerMuted ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
                </Button>
                
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endConversation}
                  className="h-16 w-16 rounded-full"
                >
                  <PhoneOff className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}