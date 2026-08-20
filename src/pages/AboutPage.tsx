import React from 'react';
import { ShieldCheck, CheckCircle, Award } from 'lucide-react';

interface AboutPageProps {
  onSelectTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTab }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider">
          About WEJOBS Global Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pioneering Fair & Structured <span className="text-amber-400">Micro-Jobs.</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Founded with a relentless commitment to clarity, atomic slot fairness, and guaranteed USD compensation for digital talent across 40+ countries.
        </p>
      </div>

      {/* Platform Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white">4,421</span>
          <span className="text-[11px] text-gray-400 block mt-1">Active Tasks</span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">$1,728,000+</span>
          <span className="text-[11px] text-emerald-400 font-bold block mt-1">TELAH DI BAYARKAN</span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white">14,221</span>
          <span className="text-[11px] text-gray-400 block mt-1">Registered Writers</span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white">40+</span>
          <span className="text-[11px] text-gray-400 block mt-1">Countries Active</span>
        </div>
      </div>

      {/* Product History & Milestones (2022 - 2026) */}
      <div className="space-y-6">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white">Platform Evolution & Milestones (2022 – 2026)</h2>
          <p className="text-xs text-gray-400 mt-1">Our chronological product journey and platform releases.</p>
        </div>
        <div className="space-y-6">
          {[
            {
              year: '2022',
              title: 'Foundation & Core Micro-Job Architecture',
              desc: 'Established the initial prototype connecting remote copywriters and editors with structured micro-assignments in USD, introducing atomic reservation slots.',
            },
            {
              year: '2023',
              title: 'Expansion to 13 Content Categories & Global Ledger',
              desc: 'Expanded beyond standard articles to include data annotation, multilingual translations, e-commerce copywriting, and automated double-entry ledger bookkeeping.',
            },
            {
              year: '2024',
              title: 'Launch of the WEJOBS Monthly Challenge & $100 Cashout Standard',
              desc: 'Introduced the gamified 500-slot Monthly Challenge with a $1,700 prize pool, alongside a strict $100.00 USD cashout security threshold for low fees and fraud protection.',
            },
            {
              year: '2025',
              title: 'Milestone: $1,000,000+ Disbursed & Multi-Currency Gateways',
              desc: 'Surpassed 10,000 verified freelancers and integrated direct local bank wires, PayPal, Wise, and USDT payout options worldwide.',
            },
            {
              year: '2026',
              title: 'Scale to 4,421 Catalog Tasks & $1,728,000.00+ Total Distributed',
              desc: 'Reached 4,421 structured tasks, advanced anti-plagiarism verification queues, and continuous partner integrations.',
            },
          ].map((item) => (
            <div key={item.year} className="flex gap-4 sm:gap-6 items-start">
              <div className="flex flex-col items-center">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-xs shadow-md shadow-amber-500/20">
                  {item.year}
                </span>
                <div className="w-0.5 h-full bg-white/5 mt-2 min-h-[40px]" />
              </div>
              <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 flex-1 space-y-1 shadow-sm">
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Engineering & Platform Principles */}
      <div className="space-y-4">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white">Platform Principles & Standards</h2>
          <p className="text-xs text-gray-400 mt-1">Our operational rules and engineering commitments.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Atomic Slot Integrity</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every job has finite slots. Once you claim a task, your spot is reserved atomically so you never work on a task that gets oversold.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Guaranteed USD Settlement</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Client funds are held in verifiable escrow. Upon client approval or review expiration, rewards are credited directly to your ledger.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Tolerance for Fraud</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We uphold strict editorial standards, originality verification, and comprehensive review mechanisms to reward genuine craft.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-[#0a0a0a] border border-amber-500/20 text-center space-y-4 shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Start Working on WEJOBS Today</h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Explore 4,421 open assignments across 13 disciplines and begin building your freelance track record.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onSelectTab('jobs')}
            className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-full text-xs font-black transition-all shadow-lg shadow-amber-500/25 active:scale-95"
          >
            Browse All 4,421 Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
