import BaseApiClient, { APIError, } from '.';

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

class MediaApi extends BaseApiClient {
  constructor() {
    super();
    this.apiPath = '/media';
  }

  async startVideoConversation(request: StartVideoConversationRequest): Promise<VideoConversationResponse> {
    try {
      return await this.makeRequest<VideoConversationResponse>('/video/start_conversation', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Video conversation failed:', error);
      throw new APIError(error instanceof Error ? error.message : 'Failed to start video conversation');
    }
  }

  async startAudioConversation(request: StartAudioConversationRequest): Promise<AudioConversationConfigResponse> {
    try {
      return await this.makeRequest<AudioConversationConfigResponse>('/audio/start_conversation', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Audio conversation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to start audio conversation');
    }
  }
}

export const mediaApi = new MediaApi(); 