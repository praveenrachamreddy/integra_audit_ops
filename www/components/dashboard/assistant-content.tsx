'use client';

import { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
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
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { mediaApi } from '@/lib/api/media';

const STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

type ConversationState = typeof STATES[keyof typeof STATES];
type ConversationType = 'video' | 'audio' | null;

// ElevenLabs configuration

export function AssistantContent() {
  // Core states
  const [type, setType] = useState<ConversationType>(null);
  const [state, setState] = useState<ConversationState>('idle');
  const [error, setError] = useState<string | null>(null);

  // Media states
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Video states
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Audio states - ElevenLabs React SDK
  const conversation = useConversation({
    onConnect: () => {
      setType('audio');
      setState('connected');
      console.log('Audio call connected');
      toast.success('Audio call connected');
    },
    onDisconnect: () => {
      if (type === 'audio') {
        setType(null);
        setState('idle');
        toast.info('Audio call ended');
      }
    },
    onMessage: (message) => {
      console.log('Conversation message:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setError('Audio connection failed');
      setState('error');
      toast.error('Audio connection failed');
    }
  });

  // Error timeout handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (state === 'error') {
      timeoutId = setTimeout(() => {
        setState('idle');
        setError(null);
        setType(null);
      }, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state]);

  // Fullscreen handler
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const startVideoCall = async () => {
    setState('connecting');
    setError(null);
    
    try {
      const response = await mediaApi.startVideoConversation({
        permit_details: {
          applicant_name: 'RegOps User',
          project_type: 'General Compliance Inquiry',
          status: 'Active'
        },
      });
      
      if (!response?.conversation_url) {
        throw new Error('Invalid video conversation response');
      }
      
      setVideoUrl(response.conversation_url);
      setType('video');
      setState('connected');
      toast.success('Video call started');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start video call';
      setError(message);
      setState('error');
      toast.error(message);
    }
  };

  const startAudioCall = async () => {
    setState('connecting');
    setError(null);
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const response = await mediaApi.startAudioConversation({
        permit_details: {
          applicant_name: 'RegOps User',
          project_type: 'General Compliance Inquiry',
          status: 'Active'
        },
      });
      
      // Start the ElevenLabs conversation with the returned agent_id
      const conversationId = await conversation.startSession({
        agentId: response.agent_id
      });
      
      console.log('Audio conversation started with ID:', conversationId);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start audio call';
      setError(message);
      setState('error');
      toast.error(message);
    }
  };

  const endCall = async () => {
    if (type === 'audio' && conversation.status === 'connected') {
      await conversation.endSession();
    }
    
    setType(null);
    setState('idle');
    setVideoUrl(null);
    setError(null);
    setIsVideoMuted(false);
    setIsAudioMuted(false);
    setIsSpeakerMuted(false);
    toast.success('Call ended');
  };

  const handleVolumeToggle = async () => {
    if (type === 'audio') {
      const newVolume = isSpeakerMuted ? 1 : 0;
      await conversation.setVolume({ volume: newVolume });
      setIsSpeakerMuted(!isSpeakerMuted);
    }
  };

  const handleRetry = () => {
    setState('idle');
    setError(null);
    setType(null);
  };

  // Selection Screen
  if (!type && state === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <MessageSquare className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get intelligent help with regulatory compliance questions
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              onClick={startVideoCall}
              className="flex items-center justify-center gap-3 h-16 text-lg transition-all hover:scale-[1.02]"
              size="lg"
            >
              <Video className="h-6 w-6" />
              <span>Start Video Call</span>
            </Button>
            
            <Button
              onClick={startAudioCall}
              variant="outline"
              className="flex items-center justify-center gap-3 h-16 text-lg transition-all hover:scale-[1.02]"
              size="lg"
            >
              <Mic className="h-6 w-6" />
              <span>Start Audio Call</span>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Choose your preferred communication method to get started
          </p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (state === 'connecting') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
        <div className="text-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Connecting...</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {type === 'video' ? 'Setting up video call with AI assistant' : 'Initializing audio call with AI assistant'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen
  if (state === 'error' && error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="max-w-md mx-4 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center gap-4">
            <Button onClick={() => type === 'video' ? startVideoCall() : startAudioCall()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" onClick={handleRetry}>
              Start Over
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            This error will automatically clear in 10 seconds
          </p>
        </div>
      </div>
    );
  }

  // Video Call Screen
  if (type === 'video' && videoUrl && state === 'connected') {
    return (
      <div ref={containerRef} className="relative min-h-screen bg-black">
        <iframe
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full absolute inset-0"
          allow="camera; microphone; autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        
        {/* Call Status */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-green-500/90 text-white border-0">
            <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
            Video Call Active
          </Badge>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-full px-8 py-4">
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
            onClick={endCall}
            className="h-12 w-12 text-red-400 hover:bg-red-500/20 rounded-full"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Audio Call Screen
  if (type === 'audio' && state === 'connected') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20">
        <div className="text-center space-y-12 px-4">
          <div className="space-y-6">
            <div className="w-40 h-40 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/30">
              <Mic className={`h-16 w-16 text-green-600 ${conversation.isSpeaking ? 'animate-pulse' : ''}`} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Audio Call Active
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {conversation.isSpeaking ? 'AI is speaking...' : 'Listening...'}
              </p>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                Status: {conversation.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="h-16 w-16 rounded-full border-2"
              title={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isAudioMuted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVolumeToggle}
              className="h-16 w-16 rounded-full border-2"
              title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
            >
              {isSpeakerMuted ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              onClick={endCall}
              className="h-16 w-16 rounded-full"
              title="End call"
            >
              <PhoneOff className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 