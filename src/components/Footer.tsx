import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Globe } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdmin }) => {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 text-slate-400 pt-16 pb-24 lg:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 flex items-center justify-center text-black font-black text-sm tracking-tighter">
                W
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase font-display">
                WEJOBS<span className="text-orange-500">.</span>PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              High-yield freelance platform engineering direct USD escrow disbursement for 4,421+ atomic writing, localization, research, and data assignments.
            </p>
            {/* Official Platform Payment Milestone */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#121212] border border-white/10 font-mono">
              <span className="w-2 h-2 bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-wider">
                $1,728,000.00+ <span className="text-orange-400 uppercase font-black">DISBURSED</span>
              </span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-4">
              Directory
            </span>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-300">
              <li>
                <button onClick={() => onSelectTab('jobs')} className="hover:text-orange-400 transition-colors">
                  4,421 Micro Tasks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('challenge')} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>Monthly Challenge</span>
                  <span className="text-[9px] bg-orange-500 text-black px-1.5 py-0.2 font-mono font-black">$1K</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('my-jobs')} className="hover:text-orange-400 transition-colors">
                  Active Assignments
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('wallet')} className="hover:text-orange-400 transition-colors">
                  Financial Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Company & Info */}
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-4">
              Foundation
            </span>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-300">
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-orange-400 transition-colors">
                  Agency Story
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('faq')} className="hover:text-orange-400 transition-colors">
                  Knowledge Base
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('help')} className="hover:text-orange-400 transition-colors">
                  Support Desk
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-slate-600 hover:text-orange-400 transition-colors text-[10px] font-mono">
                  Super Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Security */}
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-4">
              Protocols
            </span>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Zero Plagiarism</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Atomic Escrow Lock</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>USD Double-Entry</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and quick action */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500">
            © 2026 WEJOBS.PRO — MINIMALIST ARCHITECTURE, MAXIMALIST REWARDS.
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Escrow Rules</span>
            <button
              onClick={() => onSelectTab('jobs')}
              className="text-white hover:text-orange-400 flex items-center gap-1.5 transition-colors underline decoration-orange-500 underline-offset-4"
            >
              <span>Explore 4,421 Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

