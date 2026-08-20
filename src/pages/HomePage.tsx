import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Briefcase,
  Trophy,
  Star,
  ShieldCheck,
  Zap,
  Wallet,
  Lock,
  Globe,
  FileCheck,
} from 'lucide-react';
import { PlatformStats, Task, TestimonialReview, User } from '../types';
import { TaskCard } from '../components/TaskCard';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { Avatar } from '../components/Avatar';

interface HomePageProps {
  stats: PlatformStats | null;
  featuredTasks: Task[];
  testimonials: TestimonialReview[];
  currentUser: User | null;
  onSelectTab: (tab: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const CATEGORIES = [
  { name: 'Article & Blog Writing', count: 400, desc: 'How-to guides, editorials, deep-dives & long-form articles.' },
  { name: 'SEO & Web Content', count: 250, desc: 'Keyword-optimized landing pages, pillar articles & metadata.' },
  { name: 'Copywriting & Marketing', count: 250, desc: 'High-converting ad copy, email sequences & sales funnels.' },
  { name: 'Product & E-commerce', count: 200, desc: 'Amazon descriptions, Shopify listings & buyer guide specs.' },
  { name: 'Business & Professional', count: 150, desc: 'Executive summaries, proposals, SOPs & stakeholder memos.' },
  { name: 'Creative Writing', count: 350, desc: 'Short fiction, sci-fi, mysteries, worldbuilding & storytelling.' },
  { name: 'Script & Storytelling', count: 200, desc: 'YouTube scripts, TikTok hooks, podcast notes & audio ads.' },
  { name: 'Editing & Proofreading', count: 300, desc: 'Grammar audits, clarity polishing & style guide compliance.' },
  { name: 'Research & Summarization', count: 250, desc: 'Whitepapers, competitor benchmarking & market digests.' },
  { name: 'Translation & Localization', count: 250, desc: 'Indonesian, English, Spanish, Japanese & bilingual copy.' },
  { name: 'Transcription & Subtitles', count: 150, desc: 'Clean verbatim interview & timestamped audio formatting.' },
  { name: 'Data Annotation', count: 150, desc: 'Intent classification, sentiment labeling & metadata tagging.' },
  { name: 'Content Moderation', count: 100, desc: 'Editorial review, safety compliance & content triage.' },
];

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  featuredTasks,
  testimonials,
  currentUser,
  onSelectTab,
  onSelectTask,
  onOpenAuth,
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectTab('jobs');
  };

  return (
    <div className="w-full space-y-20 lg:space-y-28 pb-20">
      {/* 2. HERO SECTION - BOLD TYPOGRAPHY SIGNATURE */}
      <section className="relative pt-6 lg:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative border border-white/10 bg-[#0c0c0c] p-8 sm:p-14 lg:p-18 overflow-hidden shadow-2xl">
          {/* Subtle architectural background numeral */}
          <div className="absolute -top-6 -right-6 text-[180px] sm:text-[240px] font-black text-white/[0.03] select-none pointer-events-none font-display">
            01
          </div>

          <div className="max-w-5xl space-y-8 relative z-10">
            {/* Master Tracking Label */}
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-orange-500"></span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
                HIGH-YIELD MICRO-JOBS • ATOMIC ESCROW
              </span>
            </div>

            {/* Giant Architectural Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white font-display">
                TURN SKILLS
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white font-display">
                  INTO REWARDS
                </h1>
                <div className="hidden sm:block h-[16px] lg:h-[22px] w-[80px] lg:w-[130px] bg-orange-500 self-center"></div>
              </div>
            </div>

            {/* Subheadline & Description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              <div className="lg:col-span-7">
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                  We engineer direct escrow connections between enterprise clients and 14,221+ verified contributors. Complete structured writing, research, and localization tasks with guaranteed USD payouts.
                </p>
              </div>
              <div className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-8 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-1 font-mono">
                  Seeded Task Vault
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  4,421+ <span className="text-xs font-normal text-slate-400">ACTIVE SLOTS</span>
                </span>
              </div>
            </div>

            {/* High-Contrast Search Container */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-[#050505] border border-white/15 w-full max-w-2xl"
            >
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="SEARCH 4,421 TASKS (SEO, ARTICLE, COPYWRITING, TRANSLATION)"
                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-white placeholder-slate-500 text-xs font-bold uppercase tracking-wider font-mono"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all"
              >
                Search
              </button>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectTab('jobs')}
                className="bg-white hover:bg-slate-200 text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-white/10"
              >
                <span>Browse All Tasks</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                onClick={() => (currentUser ? onSelectTab('jobs') : onOpenAuth('register'))}
                className="px-8 py-4 bg-[#141414] hover:bg-white/10 border border-white/15 text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Start Earning</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BOLD STATS & TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-white/10 bg-[#0a0a0a] p-6 lg:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-left divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { icon: FileCheck, label: 'Writing Tasks', code: '4,421 AVAIL' },
              { icon: Zap, label: 'Instant Claims', code: '0-SEC LOCK' },
              { icon: Wallet, label: 'USD Disbursed', code: '$1.72M+ PAID' },
              { icon: ShieldCheck, label: 'Protected Escrow', code: '100% SECURE' },
              { icon: Briefcase, label: '13 Disciplines', code: 'FULL CATALOG' },
              { icon: Globe, label: 'Global Creators', code: '40+ NATIONS' },
            ].map((benefit, idx) => (
              <div key={idx} className="pt-3 sm:pt-0 sm:px-4 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.25em] text-orange-500 font-bold font-mono block">
                  {benefit.code}
                </span>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                  <benefit.icon className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span>{benefit.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW WEJOBS WORKS - ARCHITECTURAL STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              WORKFLOW EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display mt-1">
              HOW WEJOBS OPERATES
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono max-w-sm">
            Deterministic state machine: from atomic slot claim to double-entry ledger release.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'CREATE ACCOUNT', desc: 'Sign up in 30 seconds, select your profile avatar, and pass human verification.' },
            { step: '02', title: 'SELECT TASK', desc: 'Filter through 4,421 writing, SEO, translation, and analytical deliverables.' },
            { step: '03', title: 'INSPECT CRITERIA', desc: 'Review exact word counts, formatting rules, style requirements, and USD reward.' },
            { step: '04', title: 'CLAIM & LOCK', desc: 'Atomic slot reservation guarantees your slot with zero competition while in progress.' },
            { step: '05', title: 'SUBMIT WORK', desc: 'Submit inline deliverable or upload clean documents (.docx, .pdf, .md) to review queue.' },
            { step: '06', title: 'CLIENT APPROVAL', desc: 'Client audits deliverable against criteria or provides structured revision points.' },
            { step: '07', title: 'ESCROW RELEASE', desc: 'Instant ledger credit to your available balance the exact moment client approves.' },
            { step: '08', title: 'CASHOUT USD', desc: 'Cash out via PayPal, Bank Wire, Wise, or USDT with strict $100.00 USD minimum verification.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#0f0f0f] p-6 border border-white/10 hover:border-orange-500 transition-all group relative overflow-hidden"
            >
              <div className="text-3xl font-black text-white/10 group-hover:text-orange-500/30 transition-colors font-display mb-3">
                {item.step}
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. JOB CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              TAXONOMY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display mt-1">
              4,421 TASKS BY CATEGORY
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('jobs')}
            className="text-xs font-black uppercase tracking-widest text-orange-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectTab('jobs')}
              className="bg-[#0e0e0e] hover:bg-[#161616] border border-white/10 hover:border-orange-500/50 p-6 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
                    {cat.count} Tasks
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-orange-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED JOBS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              CURATED ASSIGNMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display mt-1">
              FEATURED ACTIVE TASKS
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('jobs')}
            className="text-xs font-black uppercase tracking-widest text-orange-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>Explore 4,421 Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTasks.slice(0, 6).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={onSelectTask}
            />
          ))}
        </div>
      </section>

      {/* 7. PLATFORM STATISTICS - BOLD NUMERICAL IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-white/15 bg-[#0d0d0d] p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-6 sm:pt-0 sm:px-6 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold font-mono block">
                Total Disbursed
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {stats?.totalPaidOut || '$1,728,000+'}
              </div>
              <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest block font-mono">
                TELAH DI BAYARKAN
              </span>
            </div>
            <div className="pt-6 sm:pt-0 sm:px-6 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold font-mono block">
                Task Database
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {stats?.totalTasks || 4421}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">13 Specialties</span>
            </div>
            <div className="pt-6 sm:pt-0 sm:px-6 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold font-mono block">
                Registered Writers
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {stats?.registeredFreelancers || 14221}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">40+ Jurisdictions</span>
            </div>
            <div className="pt-6 sm:pt-0 sm:px-6 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold font-mono block">
                Monthly Challenge
              </span>
              <div className="text-3xl sm:text-4xl font-black text-orange-400 font-mono">
                $1,700 <span className="text-sm font-bold text-white">USD</span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono">1st: $1,000 USD (500 Slots)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MONTHLY CHALLENGE PROMOTION - BOLD ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border border-orange-500/30 bg-[#0f0c09] p-8 sm:p-14 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest font-mono">
                <Trophy className="w-3.5 h-3.5" />
                <span>AUGUST 2026 COMPETITION • $1,700 USD POOL</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white font-display leading-[0.95]">
                WEJOBS MONTHLY CHALLENGE
              </h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                Maintain 5★ quality ratings, avoid revision cycles, and climb the live provisional leaderboard. 1st Place Champion wins $1,000 USD deposited directly to their platform ledger!
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onSelectTab('challenge')}
                  className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all"
                >
                  Join Challenge (172 Slots Left)
                </button>
                <button
                  onClick={() => onSelectTab('challenge')}
                  className="px-6 py-4 bg-[#141414] text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#050505] border border-white/15 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Prize Distribution</span>
                <span className="text-xs font-bold text-orange-400 font-mono">$1,700 USD Pool</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1.5 text-white font-bold border-b border-white/5">
                  <span>🥇 1ST PLACE CHAMPION</span>
                  <span className="text-orange-400 font-black text-sm">$1,000 USD</span>
                </div>
                <div className="flex justify-between items-center py-1 text-slate-300">
                  <span>🥈 2ND PLACE ELITE</span>
                  <span className="font-bold text-white">$300 USD</span>
                </div>
                <div className="flex justify-between items-center py-1 text-slate-300">
                  <span>🥉 3RD PLACE LAUREATE</span>
                  <span className="font-bold text-white">$150 USD</span>
                </div>
                <div className="flex justify-between items-center py-1 text-slate-400">
                  <span>⭐ BEST WRITER OF MONTH</span>
                  <span className="font-bold text-white">$100 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              COMMUNITY PROOF
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display mt-1">
              CONTRIBUTOR REVIEWS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Direct feedback from verified writers in 40+ countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0e0e0e] p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar type={rev.avatar} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.reviewerName}</h4>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">{rev.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 text-xs font-black font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                <span>{rev.workCategory}</span>
                <span className="text-emerald-400 font-bold">✓ VERIFIED DELIVERABLE</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. SPONSOR / PARTNER MARQUEE */}
      <SponsorMarquee />

      {/* 11. FINAL HIGH-IMPACT CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-white/20 bg-[#080808] p-10 sm:p-16 lg:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              READY TO SCALE YOUR PRODUCTION?
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white font-display">
              START EARNING WITH WEJOBS<span className="text-orange-500">.</span>PRO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join 14,221+ registered freelancers completing writing, editing, translation, and digital tasks every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => (currentUser ? onSelectTab('jobs') : onOpenAuth('register'))}
              className="w-full sm:w-auto bg-white hover:bg-slate-200 text-black px-10 py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Join As Freelancer</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={() => onSelectTab('jobs')}
              className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-white/10 border border-white/15 text-white text-xs font-black uppercase tracking-widest transition-colors"
            >
              Explore 4,421 Tasks
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

