-- Create daily_chat_creation table to track chat creation per day
CREATE TABLE IF NOT EXISTS daily_chat_creation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    count INTEGER NOT NULL DEFAULT 1,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, date)
);

-- Set up Row Level Security (RLS) for daily_chat_creation
ALTER TABLE daily_chat_creation ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own daily chat creation records
CREATE POLICY "Users can view their own daily chat creation records" 
ON daily_chat_creation FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own daily chat creation records
CREATE POLICY "Users can create their own daily chat creation records" 
ON daily_chat_creation FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own daily chat creation records
CREATE POLICY "Users can update their own daily chat creation records" 
ON daily_chat_creation FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_daily_chat_creation_user_id_date ON daily_chat_creation(user_id, date);

-- Create function to reset daily chat creation count at midnight
CREATE OR REPLACE FUNCTION reset_daily_chat_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the date has changed
    IF NEW.date <> OLD.date THEN
        NEW.count := 1; -- Reset count to 1 for the new day
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset count when date changes
CREATE TRIGGER reset_daily_chat_count_trigger
BEFORE UPDATE ON daily_chat_creation
FOR EACH ROW
EXECUTE FUNCTION reset_daily_chat_count(); 