import { useState } from 'react';
import { SavingsGoal, Page } from '../types';
import { saveGoals } from '../storage';
import { addGoalToSupabase, deleteGoalFromSupabase } from '../lib/database';
import { ChevronLeft, Plus, X, CheckCircle2 } from 'lucide-react';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onGoalsChange: (goals: SavingsGoal[]) => void;
  onNavigate: (page: Page) => void;
  userId?: string;
}

function monthsRemaining(goal: SavingsGoal): number {
  const left = goal.targetAmount - goal.savedAmount;
  if (goal.monthlyContribution <= 0) return 0;
  return Math.ceil(left / goal.monthlyContribution);
}

function GoalCard({ goal, onDelete }: { goal: SavingsGoal; onDelete: () => void }) {
  const pct = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
  const months = monthsRemaining(goal);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100 relative overflow-hidden">
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
          {goal.emoji}
        </div>
        <div>
          <h3 className="text-gray-800 font-bold text-base md:text-lg leading-tight">{goal.name}</h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Started {new Date(goal.startDate).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-gray-500 text-xs font-medium">Saved</p>
          <p className="text-gray-800 font-bold text-base md:text-lg">
            Ksh {goal.savedAmount.toLocaleString()}
            <span className="text-gray-400 font-normal text-sm"> / Ksh {goal.targetAmount.toLocaleString()}</span>
          </p>
        </div>
        <span className="text-[#1B5E20] font-bold text-2xl md:text-3xl">{pct}%</span>
      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #1B5E20, #69F0AE)',
          }}
        />
      </div>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        pct >= 100 ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#FFF8E1] text-[#E65100]'
      }`}>
        {pct >= 100 ? (
          <><CheckCircle2 size={12} /> Goal reached!</>
        ) : months > 0 ? (
          <>Ready in ~{months} month{months !== 1 ? 's' : ''}</>
        ) : (
          <>Keep saving!</>
        )}
      </div>
    </div>
  );
}

interface AddGoalModalProps {
  onClose: () => void;
  onAdd: (goal: SavingsGoal) => void;
}

function AddGoalModal({ onClose, onAdd }: AddGoalModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [monthly, setMonthly] = useState('');

  const emojiOptions = ['🎯', '💻', '📱', '✈️', '🏠', '🎓', '🚗', '👟', '📷', '🎮'];

  const handleSubmit = () => {
    if (!name || !target) return;
    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      emoji,
      targetAmount: Number(target),
      savedAmount: Number(saved) || 0,
      monthlyContribution: Number(monthly) || 0,
      startDate: new Date().toISOString().slice(0, 10),
    };
    onAdd(goal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center md:items-center">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md md:max-w-lg p-6 pb-10 md:pb-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-bold text-lg md:text-xl">New Savings Goal</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Pick an emoji</label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-xl text-xl transition-all ${emoji === e ? 'bg-[#1B5E20] scale-110' : 'bg-gray-100'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Goal name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Laptop"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium text-sm outline-none focus:border-[#1B5E20] transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Target (Ksh)</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium text-sm outline-none focus:border-[#1B5E20] transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Already saved</label>
              <input
                type="number"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                placeholder="0"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium text-sm outline-none focus:border-[#1B5E20] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Monthly contribution (Ksh)</label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="0"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium text-sm outline-none focus:border-[#1B5E20] transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name || !target}
          className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-95"
        >
          Add Goal
        </button>
      </div>
    </div>
  );
}

export default function SavingsGoals({ goals, onGoalsChange, onNavigate, userId }: SavingsGoalsProps) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
    onGoalsChange(updated);

    // Delete from Supabase if user is signed in
    if (userId) {
      try {
        await deleteGoalFromSupabase(id);
      } catch (error) {
        console.error('Failed to delete goal from Supabase:', error);
      }
    }
  };

  const handleAdd = async (goal: SavingsGoal) => {
    const updated = [...goals, goal];
    saveGoals(updated);
    onGoalsChange(updated);

    // Add to Supabase if user is signed in
    if (userId) {
      try {
        await addGoalToSupabase(userId, goal);
      } catch (error) {
        console.error('Failed to add goal to Supabase:', error);
      }
    }
  };

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-[#1B5E20] pt-12 pb-8 px-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => onNavigate('dashboard')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Savings Goals</h1>
            <p className="text-white/60 text-xs">Track your financial targets</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
          <p className="text-white/60 text-xs font-medium mb-1">Total saved across all goals</p>
          <p className="text-white text-2xl font-bold">Ksh {totalSaved.toLocaleString()}</p>
          <div className="mt-3">
            <div className="flex justify-between text-white/60 text-xs mb-1">
              <span>Overall progress</span>
              <span>{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#69F0AE] rounded-full"
                style={{ width: totalTarget > 0 ? `${Math.min((totalSaved / totalTarget) * 100, 100)}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block pt-8 pb-6 border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-gray-900 text-3xl font-bold">Savings Goals</h1>
          <p className="text-gray-500 text-sm mt-1">Track your financial targets</p>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1B5E20]/5 to-[#69F0AE]/5 rounded-xl p-4 border border-[#1B5E20]/10">
              <p className="text-gray-500 text-xs font-medium mb-1">Total Saved</p>
              <p className="text-[#1B5E20] text-2xl font-bold">Ksh {totalSaved.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-[#1B5E20]/5 to-[#69F0AE]/5 rounded-xl p-4 border border-[#1B5E20]/10">
              <p className="text-gray-500 text-xs font-medium mb-1">Total Target</p>
              <p className="text-[#1B5E20] text-2xl font-bold">Ksh {totalTarget.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-[#1B5E20]/5 to-[#69F0AE]/5 rounded-xl p-4 border border-[#1B5E20]/10">
              <p className="text-gray-500 text-xs font-medium mb-1">Overall Progress</p>
              <p className="text-[#1B5E20] text-2xl font-bold">{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 md:px-6 py-5 md:py-8 pb-32 md:pb-8">
        <div className="max-w-[1100px] mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={() => handleDelete(goal.id)} />
            ))}

            {/* Add new goal card */}
            <button
              onClick={() => setShowModal(true)}
              className="border-2 border-dashed border-[#1B5E20]/30 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-3 text-[#1B5E20] hover:bg-[#E8F5E9] transition-colors duration-200 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <Plus size={24} className="text-[#1B5E20]" />
              </div>
              <p className="font-semibold text-base">Add a new goal</p>
              <p className="text-[#1B5E20]/60 text-xs text-center">Set a target and start saving</p>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddGoalModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
