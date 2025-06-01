ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing messages
CREATE POLICY "Users can view messages" ON messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for inserting messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
