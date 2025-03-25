"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with your credentials
const supabaseUrl = "https://zyjwprlkrhmwjowwuukd.supabase.co"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5andwcmxrcmhtd2pvd3d1dWtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkwODM4NywiZXhwIjoyMDU4NDg0Mzg3fQ.A2WeEnr7FkMGe0m_9BqGz7eN0z9OTM0CGftMoaqgt7U"

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please provide a valid email address" }
  }

  try {
    console.log("Attempting to insert email:", email)

    // Insert the email into the 'subscribers' table
    const { error } = await supabase.from("subscribers").insert([
      {
        email,
        subscribed_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error inserting subscriber:", error)

      // Check if it's a duplicate email error
      if (error.code === "23505") {
        return { success: true, message: "You are already subscribed!" }
      }

      return {
        success: false,
        message: "Something went wrong. Please try again.",
      }
    }

    console.log("Successfully subscribed:", email)
    return { success: true, message: "Successfully subscribed!" }
  } catch (error) {
    console.error("Unexpected error in subscription process:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

