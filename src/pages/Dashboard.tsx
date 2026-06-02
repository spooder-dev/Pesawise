import { Page, BudgetData } from '../types';
import { PieChart, Target, BookOpen, Award, ChevronRight, Bell } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  userName: string;
  budget: BudgetData;
}

const quickActions = [
  { icon: PieChart, label: 'Budget\nPlanner', page: 'budget' as Page, color: 'bg-[#E8F5E9]', iconColor: 'text-[#1B5E20]' },
  { icon: Target, label: 'Savings\nGoals', page: 'goals' as Page, color: 'bg-[#E3F2FD]', iconColor: 'text-[#1565C0]' },
  { icon: BookOpen, label: 'Lessons', page: 'learn' as Page, color: 'bg-[#FFF8E1]', iconColor: 'text-[#E65100]' },
  { icon: Award, label: 'Badges', page: 'learn' as Page, color: 'bg-[#FCE4EC]', iconColor: 'text-[#880E4F]' },
];

const lessons = [
  { emoji: '💡', title: 'What is a budget?', progress: 80, subtitle: 'Module 1 · 5 min read' },
  { emoji: '📈', title: 'Growing your savings', progress: 35, subtitle: 'Module 2 · 7 min read' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ onNavigate, userName, budget }: DashboardProps) {
  const totalSpent = budget.categories
    .filter(c => c.label !== 'Savings')
    .reduce((s, c) => s + c.amount, 0);
  const savings = budget.categories.find(c => c.label === 'Savings')?.amount ?? 0;
  const remaining = budget.allowance - totalSpent - savings;

  return (
    <div className="flex flex-col w-full min-h-screen md:pb-0">
      {/* Mobile header */}
      <div className="md:hidden bg-[#1B5E20] pt-16 pb-8 px-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm font-medium">{getGreeting()},</p>
            <h2 className="text-white text-2xl font-bold">{userName} 👋</h2>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Bell size={18} className="text-white" />
          </button>
        </div>

        {/* Mobile balance card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Monthly Allowance</p>
          <p className="text-[#1B5E20] text-3xl font-bold mb-4">
            Ksh {budget.allowance.toLocaleString()}
          </p>
          <div className="flex gap-4">
            <div className="flex-1 bg-[#FFF3E0] rounded-xl p-3">
              <p className="text-[#E65100] text-xs font-medium mb-0.5">Spent</p>
              <p className="text-gray-800 text-base font-bold">Ksh {totalSpent.toLocaleString()}</p>
            </div>
            <div className="flex-1 bg-[#E8F5E9] rounded-xl p-3">
              <p className="text-[#1B5E20] text-xs font-medium mb-0.5">Saved</p>
              <p className="text-gray-800 text-base font-bold">Ksh {savings.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Budget used</span>
              <span>{Math.min(Math.round((totalSpent / budget.allowance) * 100), 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1B5E20] to-[#69F0AE] rounded-full transition-all duration-700"
                style={{ width: `${Math.min((totalSpent / budget.allowance) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop header and content */}
      <div className="hidden md:block pt-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-gray-500 text-sm font-medium">{getGreeting()},</p>
              <h1 className="text-gray-900 text-3xl font-bold">{userName} 👋</h1>
            </div>
            <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Desktop stat cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Allowance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Monthly Allowance</p>
              <p className="text-[#1B5E20] text-3xl font-bold mb-4">Ksh {budget.allowance.toLocaleString()}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Budget used</span>
                <span>{Math.min(Math.round((totalSpent / budget.allowance) * 100), 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1B5E20] to-[#69F0AE]"
                  style={{ width: `${Math.min((totalSpent / budget.allowance) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Spent */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Amount Spent</p>
              <p className="text-[#E65100] text-3xl font-bold mb-4">Ksh {totalSpent.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-[#FFA500]" />
                <span>{Math.round((totalSpent / budget.allowance) * 100)}% of allowance</span>
              </div>
            </div>

            {/* Saved */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Amount Saved</p>
              <p className="text-[#1B5E20] text-3xl font-bold mb-4">Ksh {savings.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-[#1B5E20]" />
                <span>{Math.round((savings / budget.allowance) * 100)}% of allowance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pb-32 md:pb-8">
        <div className="max-w-[1100px] mx-auto px-5 md:px-6 space-y-8">
          {/* Quick Actions */}
          <div>
            <h3 className="text-gray-800 font-bold text-base mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map(({ icon: Icon, label, page, color, iconColor }) => (
                <button
                  key={label}
                  onClick={() => onNavigate(page)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${color} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform duration-150`}>
                    <Icon size={24} className={iconColor} />
                  </div>
                  <span className="text-gray-600 text-xs md:text-sm font-medium text-center leading-tight whitespace-pre-line">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Continue Learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 font-bold text-base">Continue Learning</h3>
              <button onClick={() => onNavigate('learn')} className="text-[#1B5E20] text-xs font-semibold flex items-center gap-0.5 hover:gap-1 transition-all">
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <button
                  key={lesson.title}
                  onClick={() => onNavigate('learn')}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 flex items-start gap-4 text-left active:scale-[0.98] transition-transform duration-150 hover:shadow-md hover:border-gray-100"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#F1F8E9] flex items-center justify-center text-2xl flex-shrink-0">
                    {lesson.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-semibold text-sm md:text-base truncate">{lesson.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{lesson.subtitle}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Progress</span>
                        <span className="text-[#1B5E20] font-semibold">{lesson.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B5E20] to-[#69F0AE] rounded-full"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
