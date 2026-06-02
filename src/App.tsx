import { useState, useEffect } from 'react';
import { Page, BudgetData, SavingsGoal } from './types';
import { loadBudget, loadGoals, loadUser } from './storage';
import { loadBudgetFromSupabase, loadGoalsFromSupabase, loadUserProfile } from './lib/database';
import { supabase } from './lib/supabase';
import { useAuth } from './lib/auth';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BudgetPlanner from './pages/BudgetPlanner';
import SavingsGoals from './pages/SavingsGoals';
import LearnPage from './pages/LearnPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/BottomNav';

const PAGES_WITH_NAV: Page[] = ['dashboard', 'budget', 'goals', 'learn', 'profile'];

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState<Page>('welcome');
  const [budget, setBudget] = useState<BudgetData>(loadBudget);
  const [goals, setGoals] = useState<SavingsGoal[]>(loadGoals);
  const [userName, setUserName] = useState(loadUser().name);
  const [dataLoading, setDataLoading] = useState(true);

  // Determine which page to show based on auth state
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // User is signed in, load their data and go to dashboard
      (async () => {
        try {
          // Load user profile
          let profile = await loadUserProfile(user.id);

          // If no profile exists (first OAuth login), create one with Google name
          if (!profile) {
            const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
            await supabase
              .from('user_profiles')
              .insert([{ id: user.id, name: googleName }]);
            profile = { name: googleName };
          }

          if (profile?.name) {
            setUserName(profile.name);
          }

          // Load budget
          const budgetData = await loadBudgetFromSupabase(user.id);
          if (budgetData) {
            setBudget(budgetData);
          }

          // Load goals
          const goalsData = await loadGoalsFromSupabase(user.id);
          if (goalsData.length > 0) {
            setGoals(goalsData);
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          setDataLoading(false);
        }
      })();

      setPage('dashboard');
    } else {
      // User is not signed in, show welcome page
      setPage('welcome');
      setDataLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#1B5E20] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-white/20 border-t-[#69F0AE] mb-4" />
          <p className="text-white text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const showNav = PAGES_WITH_NAV.includes(page);

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex">
      {showNav && <Sidebar current={page} onNavigate={setPage} />}

      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        {page === 'welcome' && <WelcomePage onNavigate={setPage} />}
        {page === 'login' && <LoginPage onNavigate={setPage} />}
        {page === 'signup' && <SignupPage onNavigate={setPage} />}
        {page === 'dashboard' && (
          <Dashboard onNavigate={setPage} userName={userName} budget={budget} />
        )}
        {page === 'budget' && (
          <BudgetPlanner
            budget={budget}
            onBudgetChange={setBudget}
            onNavigate={setPage}
            userId={user?.id}
          />
        )}
        {page === 'goals' && (
          <SavingsGoals
            goals={goals}
            onGoalsChange={setGoals}
            onNavigate={setPage}
            userId={user?.id}
          />
        )}
        {page === 'learn' && <LearnPage onNavigate={setPage} />}
        {page === 'profile' && (
          <ProfilePage userName={userName} onNavigate={setPage} />
        )}
      </main>
    </div>
  );
}
