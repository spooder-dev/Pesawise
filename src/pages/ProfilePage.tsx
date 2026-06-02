import { Page } from '../types';
import { User, Bell, Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';

interface ProfilePageProps {
  userName: string;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { icon: Bell, label: 'Notifications', sub: 'Manage alerts' },
  { icon: Shield, label: 'Privacy & Security', sub: 'Keep your data safe' },
  { icon: HelpCircle, label: 'Help & Support', sub: 'Get help anytime' },
];

export default function ProfilePage({ userName, onNavigate }: ProfilePageProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-[#1B5E20] pt-12 pb-10 px-5 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-[#69F0AE] flex items-center justify-center mb-3">
          <User size={36} className="text-white" />
        </div>
        <h2 className="text-white text-xl font-bold">{userName}</h2>
        <p className="text-white/60 text-sm mt-0.5">Student · PesaWise Member</p>
        <div className="mt-4 flex gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-lg">3</p>
            <p className="text-white/60 text-xs">Goals</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">2</p>
            <p className="text-white/60 text-xs">Badges</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">80%</p>
            <p className="text-white/60 text-xs">Top lesson</p>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block pt-8 pb-6 border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1B5E20]/10 to-[#69F0AE]/10 border-2 border-[#1B5E20]/20 flex items-center justify-center flex-shrink-0">
              <User size={48} className="text-[#1B5E20]" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 text-3xl font-bold">{userName}</h1>
              <p className="text-gray-500 text-sm mt-1">Student · PesaWise Member</p>
              <div className="mt-4 flex gap-8">
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-0.5">Active Goals</p>
                  <p className="text-gray-900 font-bold text-lg">3</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-0.5">Badges Earned</p>
                  <p className="text-gray-900 font-bold text-lg">2</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-0.5">Top Lesson</p>
                  <p className="text-gray-900 font-bold text-lg">80%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 md:px-6 py-5 md:py-8 pb-32 md:pb-8">
        <div className="max-w-[1100px] mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 md:border-gray-100">
            {menuItems.map(({ icon: Icon, label, sub }, i) => (
              <button
                key={label}
                className={`w-full flex items-center gap-4 p-4 md:p-6 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors ${i < menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#1B5E20]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold text-sm md:text-base">{label}</p>
                  <p className="text-gray-400 text-xs md:text-sm">{sub}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 flex-shrink-0 hidden md:block" />
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('welcome')}
            className="w-full flex items-center gap-4 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-50 md:border-gray-100 text-left hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#FFEBEE] flex items-center justify-center flex-shrink-0">
              <LogOut size={20} className="text-[#C62828]" />
            </div>
            <p className="text-[#C62828] font-semibold text-sm md:text-base flex-1">Sign Out</p>
          </button>

          <p className="text-center text-gray-400 text-xs">PesaWise v1.0 · Made for African students</p>
        </div>
      </div>
    </div>
  );
}
