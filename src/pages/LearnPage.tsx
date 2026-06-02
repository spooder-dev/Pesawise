import { useEffect, useState } from 'react';
import { Page } from '../types';
import { ChevronRight, Star, Lock } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { loadLessonsProgress, loadBadges } from '../lib/database';

interface LearnPageProps {
  onNavigate: (page: Page) => void;
}

const modules = [
  {
    id: '1', emoji: '💡', title: 'What is a Budget?', desc: 'Learn how to plan your money wisely.', duration: '5 min', unlocked: true,
  },
  {
    id: '2', emoji: '📈', title: 'Growing Your Savings', desc: 'Discover strategies to save more.', duration: '7 min', unlocked: true,
  },
  {
    id: '3', emoji: '💳', title: 'Understanding Credit', desc: 'Know how credit works for students.', duration: '6 min', unlocked: true,
  },
  {
    id: '4', emoji: '🏦', title: 'Banking Basics', desc: 'What every student should know.', duration: '8 min', unlocked: false,
  },
  {
    id: '5', emoji: '📊', title: 'Investing 101', desc: 'Your first steps into investing.', duration: '10 min', unlocked: false,
  },
];

const allBadges = [
  { key: 'first_budget', emoji: '🌱', label: 'First Budget', description: 'Create your first budget' },
  { key: 'goal_setter', emoji: '🎯', label: 'Goal Setter', description: 'Add 3 savings goals' },
  { key: 'quick_learner', emoji: '📚', label: 'Quick Learner', description: 'Complete 5 lessons' },
  { key: 'super_saver', emoji: '💎', label: 'Super Saver', description: 'Save 50% of allowance' },
];

export default function LearnPage({ onNavigate }: LearnPageProps) {
  const { user } = useAuth();
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, any>>({});
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const progress = await loadLessonsProgress(user.id);
        setLessonsProgress(progress);

        const badges = await loadBadges(user.id);
        setEarnedBadges(badges);
      } catch (error) {
        console.error('Failed to load lessons progress:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-[#1B5E20] pt-12 pb-6 px-5">
        <h1 className="text-white text-2xl font-bold">Learn</h1>
        <p className="text-white/60 text-sm mt-1">Build your money skills</p>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block pt-8 pb-4 border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-gray-900 text-3xl font-bold">Learn</h1>
          <p className="text-gray-500 text-sm mt-1">Build your financial literacy and earn badges</p>
        </div>
      </div>

      <div className="flex-1 px-5 md:px-6 py-5 md:py-8 pb-32 md:pb-8">
        <div className="max-w-[1100px] mx-auto space-y-8">
          {/* Badges Section */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100">
            <h2 className="text-gray-800 font-bold text-base md:text-lg mb-4">Your Badges</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {allBadges.map((badge) => {
                const earned = earnedBadges.some(b => b.badge_key === badge.key);
                return (
                  <div key={badge.key} className="flex flex-col items-center gap-2 cursor-help" title={badge.description}>
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all ${earned ? 'bg-[#E8F5E9] scale-100' : 'bg-gray-100 opacity-40 grayscale scale-90'}`}>
                      {badge.emoji}
                    </div>
                    <span className={`text-center text-xs md:text-sm leading-tight ${earned ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{badge.label}</span>
                    {earned && <Star size={12} className="text-[#FFC107] fill-[#FFC107]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lessons */}
          <div>
            <h2 className="text-gray-800 font-bold text-base md:text-lg mb-4">Lessons</h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading lessons...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((m) => {
                  const progress = lessonsProgress[m.id]?.progress ?? 0;
                  const completed = lessonsProgress[m.id]?.completed ?? false;
                  return (
                    <button
                      key={m.id}
                      className={`bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100 flex items-start gap-4 text-left transition-all ${m.unlocked ? 'cursor-pointer active:scale-[0.98] hover:shadow-md hover:border-gray-100' : 'opacity-60'}`}
                    >
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 ${m.unlocked ? 'bg-[#F1F8E9]' : 'bg-gray-100'}`}>
                        {m.unlocked ? m.emoji : <Lock size={20} className="text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-gray-800 font-semibold text-sm md:text-base">{m.title}</p>
                          {progress > 0 && progress < 100 && (
                            <span className="text-[10px] font-semibold bg-[#E8F5E9] text-[#1B5E20] px-2 py-0.5 rounded-full">In progress</span>
                          )}
                          {completed && (
                            <span className="text-[10px] font-semibold bg-[#E8F5E9] text-[#1B5E20] px-2 py-0.5 rounded-full">Done</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1 md:mt-0.5">{m.desc}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{m.duration}</p>
                        {progress > 0 && (
                          <div className="mt-3 md:mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span className="text-[#1B5E20] font-semibold">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#1B5E20] to-[#69F0AE] rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      {m.unlocked && <ChevronRight size={18} className="text-gray-300 flex-shrink-0 hidden md:block" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
