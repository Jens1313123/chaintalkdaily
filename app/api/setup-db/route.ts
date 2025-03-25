import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with your credentials
const supabaseUrl = "https://zyjwprlkrhmwjowwuukd.supabase.co"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5andwcmxrcmhtd2pvd3d1dWtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkwODM4NywiZXhwIjoyMDU4NDg0Mzg3fQ.A2WeEnr7FkMGe0m_9BqGz7eN0z9OTM0CGftMoaqgt7U"

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Execute SQL to create the table
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS subscribers (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add Row Level Security (RLS) policies
        ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow service role to insert subscribers
        CREATE POLICY IF NOT EXISTS "Allow service role to insert subscribers" 
        ON subscribers FOR INSERT 
        TO service_role 
        USING (true);
        
        -- Create policy to allow service role to select subscribers
        CREATE POLICY IF NOT EXISTS "Allow service role to select subscribers" 
        ON subscribers FOR SELECT 
        TO service_role 
        USING (true);
      `,
    })

    if (error) {
      console.error("Error creating table:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database setup complete" })
  } catch (error) {
    console.error("Error in setup-db route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

