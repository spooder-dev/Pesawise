import { Page } from '../types';
import { Home, PieChart, BookOpen, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: 'dashboard' as Page, icon: Home, label: 'Home' },
  { page: 'budget' as Page, icon: PieChart, label: 'Budget' },
  { page: 'learn' as Page, icon: BookOpen, label: 'Learn' },
  { page: 'profile' as Page, icon: User, label: 'Profile' },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden w-10 h-10 rounded-lg bg-[#1B5E20] text-white flex items-center justify-center"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#1B5E20] z-35 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#69F0AE]/20 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Pesa<span className="text-[#69F0AE]">Wise</span></h1>
              <p className="text-white/50 text-xs">For Students</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ page, icon: Icon, label }) => {
            const active = current === page;
            return (
              <button
                key={page}
                onClick={() => {
                  onNavigate(page);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-[#69F0AE] text-[#1B5E20] font-semibold shadow-lg shadow-[#69F0AE]/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">v1.0 • Smart money for students</p>
        </div>
      </aside>

      {/* Mobile bottom nav for smaller screens */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
        <div className="max-w-md mx-auto flex">
          {navItems.map(({ page, icon: Icon, label }) => {
            const active = current === page;
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                  active ? 'text-[#1B5E20]' : 'text-gray-400'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-[#E8F5E9]' : ''}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#69F0AE]" />
                  )}
                </div>
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
