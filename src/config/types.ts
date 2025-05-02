export interface LoginFormInput {
  email: string
  password: string
}

export interface SignUpFormInput {
  full_name: string; 
  email: string
  password: string
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  is_default_title?: boolean;
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

export interface SubscriptionData {
  id: string;
  userId: string;
  planName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  priceId?: string;
};