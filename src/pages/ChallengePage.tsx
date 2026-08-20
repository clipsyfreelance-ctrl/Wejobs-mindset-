import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Users,
  ShieldCheck,
  CheckCircle,
  Star,
  X,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChallengeParticipant, MonthlyChallenge, User } from '../types';
import { api } from '../lib/api';
import { Avatar } from '../components/Avatar';

interface ChallengePageProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectTab: (tab: string) => void;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  currentUser,
  onOpenAuth,
  onSelectTab,
}) => {
  const [challenge, setChallenge] = useState<MonthlyChallenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<ChallengeParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // Registration modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeFraud, setAgreeFraud] = useState(false);
  const [agreeVerification, setAgreeVerification] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinSuccessData, setJoinSuccessData] = useState<ChallengeParticipant | null>(null);
  const [joinError, setJoinError] = useState('');

  // Appeal modal state
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [appealSuccess, setAppealSuccess] = useState(false);

  const loadChallengeData = async () => {
    setLoading(true);
    try {
      const [cData, lData] = await Promise.all([
        api.getChallenge(),
        api.getChallengeLeaderboard(),
      ]);
      setChallenge(cData);
      setLeaderboard(lData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallengeData();
  }, []);

  const userParticipant = currentUser
    ? leaderboard.find((p) => p.userId === currentUser.id)
    : null;

  const isFull = challenge ? challenge.remainingSlots <= 0 : false;

  const handleJoinChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (!agreeRules || !agreeFraud || !agreeVerification) {
      setJoinError('You must agree to all 3 competition & verification rules.');
      return;
    }

    setJoining(true);
    setJoinError('');

    try {
      const res = await api.joinChallenge(currentUser.id);
      if (res.success && res.participant) {
        setJoinSuccessData(res.participant);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ffffff', '#e2e8f0'],
          });
        } catch (e) {}
        loadChallengeData();
      }
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join challenge.');
    } finally {
      setJoining(false);
    }
  };

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    setAppealSuccess(true);
    setTimeout(() => {
      setAppealModalOpen(false);
      setAppealSuccess(false);
      setAppealReason('');
    }, 1500);
  };

  if (loading || !challenge) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading Challenge Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. HERO BANNER */}
      <div className="relative border border-orange-500/30 bg-[#0c0c0c] p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>{challenge.period.toUpperCase()} CHALLENGE • $1,700 USD POOL</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white font-display leading-[0.92]">
              {challenge.name}
            </h1>
            <p className="text-base sm:text-lg text-orange-400 font-bold uppercase tracking-wider font-mono">
              {challenge.tagline}
            </p>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
              {challenge.description}
            </p>

            {/* Live Participant Slot Counter */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="px-5 py-3 bg-[#050505] border border-white/10 flex items-center gap-3">
                <Users className="w-4 h-4 text-orange-500" />
                <div className="text-xs font-mono">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Live Slots:</span>
                  <strong className="text-white">
                    {challenge.registeredCount} / {challenge.maxParticipants} ({challenge.remainingSlots} Slots Left)
                  </strong>
                </div>
              </div>

              {/* Join / Status Action Button */}
              {userParticipant ? (
                <div className="px-6 py-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
                  <CheckCircle className="w-4 h-4 stroke-[3]" />
                  <span>YOU'RE IN! (Rank #{userParticipant.rank} • {userParticipant.score} Pts)</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth('login');
                    else {
                      setJoinError('');
                      setJoinSuccessData(null);
                      setJoinModalOpen(true);
                    }
                  }}
                  disabled={isFull}
                  className={`px-8 py-4 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                    isFull
                      ? 'bg-[#141414] text-slate-500 cursor-not-allowed border border-white/10'
                      : 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 active:scale-95'
                  }`}
                >
                  <Trophy className="w-4 h-4 stroke-[2.5]" />
                  <span>{isFull ? 'SLOTS FULL (500/500)' : 'JOIN CHALLENGE (Free Entry)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Prize Breakdown */}
          <div className="lg:col-span-4 bg-[#050505] border border-white/15 p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Prize Pool</span>
              <span className="text-lg font-black text-orange-400">${challenge.prizePool} USD</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 flex justify-between items-center text-white font-bold">
                <span className="flex items-center gap-2">🥇 1st Place Champion</span>
                <span className="text-orange-400 font-black text-sm">${challenge.firstPrize} USD</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-300">
                <span>🥈 2nd Place</span>
                <strong className="text-white font-bold">$300 USD</strong>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-300">
                <span>🥉 3rd Place</span>
                <strong className="text-white font-bold">$150 USD</strong>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>⭐ Best Quality Deliverable</span>
                <strong className="text-white font-bold">$100 USD</strong>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>🚀 Rising Star (&lt;90 Days)</span>
                <strong className="text-white font-bold">$75 USD</strong>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>⚡ Consistency Award</span>
                <strong className="text-white font-bold">$75 USD</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FAIR PLAY BANNER */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
              PLAY FAIR. WIN FAIR.
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-1">
              Leaderboard rankings are provisional throughout the active competition. Final rewards are officially distributed only after post-sprint quality verification and anti-fraud review.
            </p>
          </div>
        </div>
        <button
          onClick={() => setAppealModalOpen(true)}
          className="px-6 py-3 bg-[#141414] hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white whitespace-nowrap transition-colors self-start md:self-auto"
        >
          Submit Score Appeal
        </button>
      </div>

      {/* 3. LIVE LEADERBOARD */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase tracking-tight text-white font-display">
                PROVISIONAL LEADERBOARD
              </h2>
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Points updated automatically upon client task acceptance and 5★ review bonus calculations.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {leaderboard.length} Ranked Participants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-400 border-b border-white/10 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Freelancer</th>
                <th className="py-3 px-3">Qualifying Tasks</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leaderboard.map((p) => {
                const isMe = currentUser && p.userId === currentUser.id;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isMe ? 'bg-orange-500/10 border-l-2 border-orange-500' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-4 px-3 font-black text-white">
                      {p.rank === 1 ? '🥇 #1' : p.rank === 2 ? '🥈 #2' : p.rank === 3 ? '🥉 #3' : `#${p.rank}`}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar type={p.avatar} size="xs" />
                        <span className="font-bold text-white font-sans">
                          {p.displayName} {isMe && <span className="text-orange-400 text-[10px] font-normal font-mono">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-300">
                      {p.completedQualifyingTasks} tasks
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold">{p.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <span className="text-sm font-black text-orange-400 font-mono">
                        {p.score} <span className="text-[10px] font-normal text-slate-500">PTS</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. OFFICIAL MONTHLY CHALLENGE RULES */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-orange-500" />
          <span>OFFICIAL MONTHLY CHALLENGE RULES</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 pt-2">
          {[
            { num: '01', title: 'One Account', desc: 'Each participant may use only one registered and verified WEJOBS account.' },
            { num: '02', title: 'Genuine Work', desc: 'All work must be genuinely performed per task instructions with zero plagiarism.' },
            { num: '03', title: 'No Manipulation', desc: 'Manipulating tasks, submissions, ratings, referrals, or points is strictly prohibited.' },
            { num: '04', title: 'No Collusion', desc: 'Collaborating with task creators to manipulate competition outcomes results in immediate disqualification.' },
            { num: '05', title: 'Quality Matters', desc: 'Points scale by difficulty (+5 to +50 pts), 5★ ratings (+5 pts), and zero revisions (+5 pts).' },
            { num: '06', title: 'Deadlines', desc: 'Assignments submitted past deadline may lose bonus points or receive a -3 pts penalty.' },
            { num: '07', title: 'Fraud Investigation', desc: 'Suspicious activities are held for multi-stage review before final score calculation.' },
            { num: '08', title: 'Provisional Rankings', desc: 'Rankings during the month are provisional until post-competition audit is complete.' },
            { num: '09', title: 'Disqualification', desc: 'Proven cheating results in total disqualification and forfeiture of reward prizes.' },
            { num: '10', title: 'Reward Verification', desc: 'Cash rewards are credited directly to verified USD balance ledgers upon final audit.' },
          ].map((rule) => (
            <div key={rule.num} className="p-4 bg-[#050505] border border-white/10 space-y-1">
              <div className="flex items-center gap-2 font-bold uppercase text-white font-mono text-[11px]">
                <span className="text-orange-500">{rule.num}.</span>
                <span>{rule.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PREVIOUS CHAMPIONS SHOWCASE */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-500" />
          <span>PREVIOUS CHAMPIONS HALL OF FAME</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {challenge.previousChampions.map((champ, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#050505] border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar type={champ.avatar} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-white">{champ.winnerName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{champ.country} • {champ.monthYear}</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-black text-orange-400 block">{champ.prize}</span>
                <span className="text-[10px] text-slate-500">{champ.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setJoinModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {joinSuccessData ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase text-white font-display">YOU'RE REGISTERED!</h3>
                  <p className="text-xs text-slate-400">
                    You have joined the {challenge.period} WEJOBS Monthly Challenge.
                  </p>
                </div>
                <div className="p-4 bg-[#050505] border border-white/10 text-left text-xs space-y-2 text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Participant ID:</span>
                    <strong className="text-white">{joinSuccessData.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Date:</span>
                    <strong className="text-white">{new Date().toLocaleDateString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Rank:</span>
                    <strong className="text-white">Provisional #{joinSuccessData.rank}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Starting Points:</span>
                    <strong className="text-orange-400">0 pts</strong>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setJoinModalOpen(false);
                    onSelectTab('jobs');
                  }}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md"
                >
                  Start Taking Jobs to Score Points
                </button>
              </div>
            ) : (
              <form onSubmit={handleJoinChallenge} className="space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 font-mono">
                    FREE COMPETITION ENTRY
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white font-display">
                    JOIN {challenge.period} CHALLENGE
                  </h3>
                  <p className="text-xs text-slate-400">
                    Compete for the $1,000 USD first prize among 500 verified freelancers.
                  </p>
                </div>

                {/* Freelancer Profile Display */}
                <div className="p-3.5 bg-[#050505] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <Avatar type={currentUser?.avatar} size="xs" />
                    <div>
                      <strong className="text-white block font-sans">{currentUser?.name}</strong>
                      <span className="text-[11px] text-slate-400">{currentUser?.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">✓ VERIFIED</span>
                </div>

                {/* 3 Checkboxes */}
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeRules}
                      onChange={(e) => setAgreeRules(e.target.checked)}
                      className="accent-orange-500 mt-0.5"
                    />
                    <span>I have read and agree to the Official Monthly Challenge Rules.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeFraud}
                      onChange={(e) => setAgreeFraud(e.target.checked)}
                      className="accent-orange-500 mt-0.5"
                    />
                    <span>I understand that fraudulent activity or plagiarism will result in disqualification.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeVerification}
                      onChange={(e) => setAgreeVerification(e.target.checked)}
                      className="accent-orange-500 mt-0.5"
                    />
                    <span>I understand that the leaderboard is provisional until winners are finalized.</span>
                  </label>
                </div>

                {joinError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                    {joinError}
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setJoinModalOpen(false)}
                    className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md disabled:opacity-50"
                  >
                    {joining ? 'Registering...' : 'Lock My Competition Slot'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* APPEAL MODAL */}
      {appealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setAppealModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black uppercase text-white font-display mb-1">Challenge Score Appeal</h3>
            <p className="text-xs text-slate-400 mb-4">
              Submit an official appeal for ranking audits, point recalculations, or review inquiries.
            </p>

            {appealSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold text-center">
                ✓ Appeal submitted to moderation compliance team.
              </div>
            ) : (
              <form onSubmit={handleSendAppeal} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Describe your appeal details, referencing specific task IDs and review logs..."
                  className="w-full p-3.5 bg-[#050505] border border-white/15 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAppealModalOpen(false)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md"
                  >
                    Submit Appeal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
