import { createClient } from '@supabase/supabase-js';
import { Opportunity } from '../types';

export const SUPABASE_PROJECT_ID = 'dogqlfykkstebvpipplk';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Zg7ta6KHFs6k3Tn9HHrVMQ_DKvc3tew';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Fetch opportunities from Supabase.
 * Returns null if table does not exist or error occurs (fallback to local data).
 */
export async function fetchOpportunitiesFromSupabase(): Promise<Opportunity[] | null> {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch opportunities notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      titleRu: row.title_ru || undefined,
      category: row.category,
      country: row.country,
      deadline: row.deadline,
      daysRemaining: row.days_remaining ?? undefined,
      eligibility: row.eligibility || '',
      format: row.format || 'Offline',
      funding: row.funding || 'Fully funded',
      shortDescription: row.short_description || '',
      officialLink: row.official_link || '',
      targetAudience: Array.isArray(row.target_audience)
        ? row.target_audience
        : ['Students', 'Youth'],
      statusBadge: row.status_badge || 'Open',
    }));
  } catch (err) {
    console.warn('Supabase connection note:', err);
    return null;
  }
}

/**
 * Insert a newly submitted opportunity into Supabase.
 */
export async function insertOpportunityToSupabase(opp: Opportunity): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: opp.id,
      title: opp.title,
      title_ru: opp.titleRu || null,
      category: opp.category,
      country: opp.country,
      deadline: opp.deadline,
      eligibility: opp.eligibility,
      format: opp.format,
      funding: opp.funding,
      short_description: opp.shortDescription,
      official_link: opp.officialLink,
      target_audience: opp.targetAudience,
      status_badge: opp.statusBadge,
    };

    const { error } = await supabase.from('opportunities').insert([payload]);

    if (error) {
      console.warn('Supabase insert opportunity warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Submit feedback or inquiry to Supabase.
 */
export async function submitContactMessage(
  input: ContactMessageInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('contact_messages').insert([
      {
        name: input.name,
        email: input.email,
        subject: input.subject || 'Website Inquiry',
        message: input.message,
      },
    ]);

    if (error) {
      console.warn('Supabase contact submission warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Subscribe email newsletter in Supabase.
 */
export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('newsletter_subscribers').insert([
      {
        email: email.trim().toLowerCase(),
      },
    ]);

    if (error) {
      // 23505 is unique violation in Postgres
      if (error.code === '23505') {
        return { success: true }; // Already subscribed
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Quick ping to test Supabase backend readiness.
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  hasOpportunitiesTable: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase.from('opportunities').select('id').limit(1);

    if (!error) {
      return {
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        hasOpportunitiesTable: true,
        message: 'Connected to Supabase. Table public.opportunities is ready.',
      };
    }

    if (error.code === 'PGRST205') {
      return {
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        hasOpportunitiesTable: false,
        message: 'Connected to Supabase project dogqlfykkstebvpipplk! Run SQL schema to enable live database persistence.',
      };
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      hasOpportunitiesTable: false,
      message: `Connected (${error.message})`,
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      hasOpportunitiesTable: false,
      message: err?.message || 'Connection failed',
    };
  }
}

/**
 * Ready-to-execute SQL script for Supabase SQL Editor
 */
export const SUPABASE_SCHEMA_SQL = `-- Run this in Supabase Dashboard -> SQL Editor for project dogqlfykkstebvpipplk

-- 1. Opportunities Table (fellowships, competitions, grants)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_ru TEXT,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  deadline TEXT NOT NULL,
  eligibility TEXT,
  format TEXT DEFAULT 'Offline',
  funding TEXT DEFAULT 'Fully funded',
  short_description TEXT NOT NULL,
  official_link TEXT,
  target_audience TEXT[] DEFAULT ARRAY['All']::TEXT[],
  status_badge TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contact & Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access on opportunities
CREATE POLICY "Allow public read on opportunities"
  ON public.opportunities FOR SELECT USING (true);

-- Allow public insert on opportunities
CREATE POLICY "Allow public insert on opportunities"
  ON public.opportunities FOR INSERT WITH CHECK (true);

-- Allow public insert on contact messages
CREATE POLICY "Allow public insert on contact_messages"
  ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow public insert on newsletter subscribers
CREATE POLICY "Allow public insert on newsletter_subscribers"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
`;
