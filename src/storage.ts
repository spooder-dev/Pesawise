import { BudgetData, SavingsGoal } from './types';

const BUDGET_KEY = 'pesawise_budget';
const GOALS_KEY = 'pesawise_goals';
const USER_KEY = 'pesawise_user';

export const defaultBudget: BudgetData = {
  allowance: 5000,
  categories: [
    { label: 'Food', emoji: '🍱', amount: 1500, color: '#1B5E20' },
    { label: 'Transport', emoji: '🚌', amount: 800, color: '#2E7D32' },
    { label: 'School', emoji: '📚', amount: 600, color: '#388E3C' },
    { label: 'Savings', emoji: '🏦', amount: 700, color: '#43A047' },
    { label: 'Airtime', emoji: '📱', amount: 300, color: '#69F0AE' },
    { label: 'Fun', emoji: '🎉', amount: 400, color: '#A5D6A7' },
  ],
};

export const defaultGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'New Laptop',
    emoji: '💻',
    targetAmount: 45000,
    savedAmount: 18000,
    startDate: '2025-01-01',
    monthlyContribution: 2500,
  },
  {
    id: '2',
    name: 'School Trip',
    emoji: '✈️',
    targetAmount: 12000,
    savedAmount: 7200,
    monthlyContribution: 1000,
    startDate: '2025-03-01',
  },
];

export function loadBudget(): BudgetData {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : defaultBudget;
  } catch {
    return defaultBudget;
  }
}

export function saveBudget(data: BudgetData): void {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(data));
}

export function loadGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : defaultGoals;
  } catch {
    return defaultGoals;
  }
}

export function saveGoals(goals: SavingsGoal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function loadUser(): { name: string } {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : { name: 'Amara' };
  } catch {
    return { name: 'Amara' };
  }
}

export function saveUser(user: { name: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
