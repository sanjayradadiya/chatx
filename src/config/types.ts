export interface LoginFormInput {
  email: string
  password: string
}

export interface SignUpFormInput {
  fullname: string; 
  email: string
  password: string
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export type MessageType = 'text' | 'emoji' | 'image';

export interface ChatMessage {
  id: string;
  text: string;
  message_type: MessageType;
  file_url?: string;
  session_id: string;
  user_id: string;
  is_ai: boolean;
  created_at: string;
}