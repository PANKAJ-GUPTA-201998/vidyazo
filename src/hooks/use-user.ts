"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

// Check if Supabase is configured with real credentials
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    !!key &&
    url !== "your_supabase_url" &&
    key !== "your_supabase_anon_key" &&
    url.startsWith("http")
  );
}

// Mock profile for development when Supabase is not configured
const MOCK_PROFILE: Profile = {
  id: "dev-user-001",
  phone: "9876543210",
  full_name: "Demo Student",
  role: "student",
  class_grade: 10,
  board: "CBSE",
  parent_phone: "9876543211",
  batch_id: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, use mock data for development
    if (!isSupabaseConfigured()) {
      // Set via async callback to avoid calling setState synchronously in effect
      Promise.resolve().then(() => {
        setProfile(MOCK_PROFILE);
        setLoading(false);
      });
      return;
    }

    const supabase = createClient();

    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setProfile(null);
      window.location.href = "/login";
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signOut };
}
