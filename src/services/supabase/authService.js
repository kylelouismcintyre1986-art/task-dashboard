import { supabaseRequest } from './supabaseClient';

export const getCurrentUser = () => supabaseRequest('auth/v1/user');

export const signOut = () => supabaseRequest('auth/v1/logout', { method: 'POST' });
