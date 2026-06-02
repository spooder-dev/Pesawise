import { Page } from '../types';
import { Sprout, TrendingUp, BookOpen, ShieldCheck } from 'lucide-react';

interface WelcomePageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  { icon: TrendingUp, title: 'Track your spending', desc: 'Know exactly where your money goes every month.' },
  { icon: Sprout, title: 'Build saving habits', desc: 'Set goals and watch your savings grow steadily.' },
  { icon: BookOpen, title: 'Learn financial skills', desc: 'Bite-sized lessons designed for students.' },
  { icon: ShieldCheck, title: 'Stay in control', desc: 'Budget smarter and avoid running out of money.' },
];

export default function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-[#1B5E20] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
          <span className="text-4xl">💰</span>
        </div>

        <h1 className="text-5xl font-bold text-white tracking-tight mb-3">
          Pesa<span className="text-[#69F0AE]">Wise</span>
        </h1>
        <p className="text-lg text-white/80 font-medium max-w-xs leading-snug">
          Smart money skills for students
        </p>

        {/* Features */}
        <div className="mt-10 w-full max-w-sm space-y-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#69F0AE]/20 flex items-center justify-center">
                <Icon size={18} className="text-[#69F0AE]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 pb-12 space-y-3 max-w-sm mx-auto w-full">
        <button
          onClick={() => onNavigate('signup')}
          className="w-full bg-[#69F0AE] hover:bg-[#57e09a] text-[#1B5E20] font-bold py-4 rounded-2xl text-base shadow-lg shadow-[#69F0AE]/30 transition-all duration-200 active:scale-95"
        >
          Get started — it's free
        </button>
        <button
          onClick={() => onNavigate('login')}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-2xl text-base border border-white/20 transition-all duration-200 active:scale-95"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
