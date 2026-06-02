export interface BudgetCategory {
  label: string;
  emoji: string;
  amount: number;
  color: string;
}

export interface BudgetData {
  allowance: number;
  categories: BudgetCategory[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  monthlyContribution: number;
}

export type Page = 'welcome' | 'login' | 'signup' | 'dashboard' | 'budget' | 'goals' | 'learn' | 'profile';
