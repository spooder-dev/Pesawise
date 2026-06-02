import { useState } from 'react';
import { BudgetData, BudgetCategory } from '../types';
import { saveBudget } from '../storage';
import { saveBudgetToSupabase } from '../lib/database';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { Page } from '../types';

interface BudgetPlannerProps {
  budget: BudgetData;
  onBudgetChange: (b: BudgetData) => void;
  onNavigate: (page: Page) => void;
  userId?: string;
}

export default function BudgetPlanner({ budget, onBudgetChange, onNavigate }: BudgetPlannerProps) {
  const [allowance, setAllowance] = useState(String(budget.allowance));
  const [categories, setCategories] = useState<BudgetCategory[]>(budget.categories);
  const [saved, setSaved] = useState(false);

  const totalAllocated = categories.reduce((s, c) => s + c.amount, 0);
  const remaining = Number(allowance) - totalAllocated;

  const handleAmountChange = (index: number, value: string) => {
    const num = Math.max(0, Number(value) || 0);
    const updated = categories.map((c, i) => i === index ? { ...c, amount: num } : c);
    setCategories(updated);
  };

  const handleSave = async () => {
    const newBudget: BudgetData = { allowance: Number(allowance) || 0, categories };
    saveBudget(newBudget);
    onBudgetChange(newBudget);

    // Save to Supabase if user is signed in
    if (userId) {
      try {
        await saveBudgetToSupabase(userId, newBudget);
      } catch (error) {
        console.error('Failed to save budget to Supabase:', error);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const chartData = categories.filter(c => c.amount > 0).map(c => ({
    name: c.label,
    value: c.amount,
    color: c.color,
  }));

  const centerLabel = remaining >= 0
    ? `Ksh ${remaining.toLocaleString()}`
    : `-Ksh ${Math.abs(remaining).toLocaleString()}`;

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-[#1B5E20] pt-12 pb-5 px-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => onNavigate('dashboard')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Budget Planner</h1>
            <p className="text-white/60 text-xs">Plan your monthly spending</p>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block pt-8 pb-4 border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-gray-900 text-3xl font-bold">Budget Planner</h1>
          <p className="text-gray-500 text-sm mt-1">Plan and track your monthly spending</p>
        </div>
      </div>

      <div className="flex-1 px-5 md:px-6 py-5 md:py-8 pb-32 md:pb-8">
        <div className="max-w-[1100px] mx-auto space-y-5 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Allowance Input */}
            <div className="md:col-span-1 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100">
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Monthly Allowance
              </label>
              <div className="flex items-center gap-2 border-2 border-[#1B5E20]/20 rounded-xl px-4 py-3 focus-within:border-[#1B5E20] transition-colors bg-white">
                <span className="text-[#1B5E20] font-bold text-base">Ksh</span>
                <input
                  type="number"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  className="flex-1 text-gray-800 font-bold text-xl outline-none bg-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Remaining display */}
            <div className="md:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Budget Summary</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Total Allocated</p>
                  <p className="text-gray-800 text-2xl font-bold">Ksh {totalAllocated.toLocaleString()}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 font-medium ${remaining >= 0 ? 'text-[#1B5E20]' : 'text-red-600'}`}>
                    {remaining >= 0 ? 'Remaining' : 'Over Budget'}
                  </p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-[#1B5E20]' : 'text-red-600'}`}>
                    {centerLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100">
            <h3 className="text-gray-700 font-bold text-base md:text-lg mb-4">Spending Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <div key={cat.label} className="bg-[#F9FBF9] rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-gray-700 font-semibold text-sm">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-2 bg-white">
                    <span className="text-gray-400 text-xs font-medium">Ksh</span>
                    <input
                      type="number"
                      value={cat.amount === 0 ? '' : cat.amount}
                      onChange={(e) => handleAmountChange(i, e.target.value)}
                      className="flex-1 text-gray-800 font-semibold text-sm outline-none w-full bg-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-50 md:border-gray-100">
            <h3 className="text-gray-700 font-bold text-base md:text-lg mb-4">Spending Breakdown</h3>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${
              remaining >= 0 ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#FFEBEE] text-[#B71C1C]'
            }`}>
              <span>{remaining >= 0 ? 'Remaining' : 'Over budget'}:</span>
              <span>{centerLabel}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="relative" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1, color: '#E0E0E0' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {(chartData.length > 0 ? chartData : [{ color: '#E0E0E0' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`Ksh ${value.toLocaleString()}`, '']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-xs font-medium">Remaining</p>
                  <p className={`font-bold text-base leading-tight ${remaining >= 0 ? 'text-[#1B5E20]' : 'text-[#B71C1C]'}`}>
                    {centerLabel}
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-gray-600 text-sm flex-1">{cat.emoji} {cat.label}</span>
                      <span className="text-gray-700 font-semibold text-sm">Ksh {cat.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full md:w-auto md:min-w-xs py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              saved
                ? 'bg-[#69F0AE] text-[#1B5E20]'
                : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[#1B5E20]/30'
            } active:scale-95`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={20} />
                Budget saved!
              </>
            ) : (
              'Save my budget'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
