// Reader accounts, for scripts that run in the reader's browser.
//
// The accounts live in Supabase (see supabase/schema.sql). This file is
// the one place that talks to it, so the rest of the site only ever
// asks simple questions: is anyone signed in? give me the connection.
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { site } from '../data/site';

/** False until the Supabase address and key are filled in in site.ts.
    Everything to do with accounts checks this first. */
export const accountsConfigured = Boolean(site.supabase.url && site.supabase.anonKey);

let connection: Promise<SupabaseClient> | null = null;

/** The connection to Supabase, or null if accounts are switched off.
    The Supabase library is large, so it is only downloaded the first
    time this is called (that is what `import()` does), not on every
    page for every reader. */
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!accountsConfigured) return null;
  connection ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(site.supabase.url, site.supabase.anonKey),
  );
  return connection;
}

/** A quick guess at whether someone is signed in, made without
    downloading the library: Supabase keeps the session in the browser's
    storage under a name like "sb-abc123-auth-token". Good enough to
    decide what the masthead says; anything that matters asks
    currentUser() instead. */
export function looksSignedIn(): boolean {
  if (!accountsConfigured) return false;
  try {
    return Object.keys(localStorage).some((key) => /^sb-.+-auth-token$/.test(key));
  } catch {
    return false; // storage blocked: treat as signed out
  }
}

/** The signed-in reader, or null. */
export async function currentUser(): Promise<User | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

/** The signed-in reader's profile row: their display name, and whether
    they are an administrator. */
export async function currentProfile(): Promise<{ id: string; display_name: string; is_admin: boolean } | null> {
  const [supabase, user] = [await getSupabase(), await currentUser()];
  if (!supabase || !user) return null;
  const { data } = await supabase.from('profiles').select('id, display_name, is_admin').eq('id', user.id).maybeSingle();
  // A profile is made automatically at sign-up; this covers the instant before.
  const profile = data ?? { id: user.id, display_name: 'A Reader', is_admin: false };
  rememberRole(profile.is_admin);
  return profile;
}

// Whether the signed-in reader is an administrator is remembered in the
// browser, so the masthead can show "Editor-in-Chief" at once on every
// page without asking the database each time. This is for show only:
// changing it by hand changes a label and nothing else, because the
// database decides what anyone may actually do.
const ROLE_KEY = 'absurdist:role';

function rememberRole(isAdmin: boolean) {
  try {
    localStorage.setItem(ROLE_KEY, isAdmin ? 'admin' : 'reader');
  } catch {
    // Not remembered; the masthead will ask again next time.
  }
}

/** The role remembered from the last time the profile was read, or
    null if it has not been read in this browser yet. */
export function rememberedRole(): 'admin' | 'reader' | null {
  try {
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'admin' || role === 'reader' ? role : null;
  } catch {
    return null;
  }
}

/** Forget the role, on signing out. */
export function forgetRole() {
  try {
    localStorage.removeItem(ROLE_KEY);
  } catch {
    // Nothing to forget.
  }
}

/** "13 October 2026", for the date on a letter. */
export const formatLetterDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
