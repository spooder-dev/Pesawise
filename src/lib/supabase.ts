import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BudgetData = {
  allowance: number;
  categories: Array<{
    label: string;
    emoji: string;
    amount: number;
    color: string;
  }>;
};

export type SavingsGoal = {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  startDate: string;
};
