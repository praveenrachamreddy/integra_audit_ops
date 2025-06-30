import { apiClient } from './auth';

export interface StartVideoConversationRequest {
  permit_details: Record<string, any>;
}

export interface VideoConversationResponse {
  conversation_url: string;
}

export interface StartAudioConversationRequest {
  permit_details: Record<string, any>;
}

export interface AudioConversationConfigResponse {
  agent_id: string;
  prompt: string;
}

class MediaApi {
  async startVideoConversation(request: StartVideoConversationRequest): Promise<VideoConversationResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/media/video/start_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getAccessToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start video conversation');
      }

      return response.json();
    } catch (error) {
      console.error('Video conversation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to start video conversation');
    }
  }

  async startAudioConversation(request: StartAudioConversationRequest): Promise<AudioConversationConfigResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/media/audio/start_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getAccessToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start audio conversation');
      }

      return response.json();
    } catch (error) {
      console.error('Audio conversation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to start audio conversation');
    }
  }
}

export const mediaApi = new MediaApi(); 