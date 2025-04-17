-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_ai BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) for chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own sessions
CREATE POLICY "Users can view their own sessions" 
ON chat_sessions FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own sessions
CREATE POLICY "Users can create their own sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Set up Row Level Security (RLS) for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see messages from their sessions
CREATE POLICY "Users can view messages from their sessions" 
ON chat_messages FOR SELECT 
USING (
    user_id = auth.uid() OR 
    session_id IN (
        SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
);

-- Create policy to allow users to insert messages into their sessions
CREATE POLICY "Users can insert messages into their sessions" 
ON chat_messages FOR INSERT 
WITH CHECK (
    user_id = auth.uid() AND
    session_id IN (
        SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id); 