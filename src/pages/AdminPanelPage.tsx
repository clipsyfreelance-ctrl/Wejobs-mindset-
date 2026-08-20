import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Wallet,
  CheckCircle,
  PlusCircle,
  CreditCard,
  XCircle,
  FileCheck,
  FileText,
  AlertCircle,
  Search,
  Eye,
  Star,
  Download,
  RotateCw,
  Clock,
  ShieldCheck,
  DollarSign,
  X,
  Send,
  Building2,
  Check,
} from 'lucide-react';
import { MonthlyChallenge, PlatformStats, Task, TaskAssignment, User, WithdrawalRequest, AuditLog } from '../types';
import { api } from '../lib/api';

interface AdminPanelPageProps {
  onSelectTab: (tab: string) => void;
  onOpenCreateTask: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onSelectTab,
  onOpenCreateTask,
}) => {
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'withdrawals' | 'stats' | 'users' | 'tasks' | 'challenge' | 'audit'
  >('submissions');
  
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [challenge, setChallenge] = useState<MonthlyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  // Submissions filter & review modal
  const [submissionFilter, setSubmissionFilter] = useState<string>('SUBMITTED');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<TaskAssignment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5.0);
  const [reviewNotes, setReviewNotes] = useState<string>('Deliverable fulfills all acceptance criteria. Reward has been verified and credited to worker wallet.');
  const [reviewAction, setReviewAction] = useState<'ACCEPT' | 'REVISE' | 'REJECT'>('ACCEPT');
  const [processingReview, setProcessingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Withdrawal filter & modal
  const [withdrawalFilter, setWithdrawalFilter] = useState<string>('PENDING');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Data rekening/rekening tujuan tidak sesuai atau belum terverifikasi.');
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [withdrawalSuccessMessage, setWithdrawalSuccessMessage] = useState('');

  // Challenge winner modal
  const [selectedWinnerId, setSelectedWinnerId] = useState('');
  const [selectedWinnerPrize, setSelectedWinnerPrize] = useState('$1,000 USD');
  const [finalizingChallenge, setFinalizingChallenge] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, tRes, wRes, aRes, cRes, lRes] = await Promise.all([
        api.getStats(),
        api.getAdminUsers(),
        api.getTasks({ limit: 50 }),
        api.getAdminWithdrawals(),
        api.getAllAssignments(),
        api.getChallenge(),
        api.getAuditLogs(),
      ]);
      setStats(sRes);
      setUsers(uRes);
      setTasks(tRes.tasks);
      setWithdrawals(wRes);
      setAssignments(aRes);
      setChallenge(cRes);
      setAuditLogs(lRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handler for Confirming Task Deliverable (Approve & Credit Saldo, Request Revision, or Reject)
  const handleConfirmTaskDeliverable = async (actionType: 'ACCEPT' | 'REVISE' | 'REJECT') => {
    if (!selectedSubmission) return;
    setProcessingReview(true);
    setReviewSuccessMessage('');

    try {
      const defaultNotes =
        actionType === 'ACCEPT'
          ? (reviewNotes || 'Deliverable disetujui Admin. Saldo telah masuk ke wallet.')
          : actionType === 'REVISE'
          ? (reviewNotes || 'Mohon perbaiki deliverable sesuai catatan admin.')
          : (reviewNotes || 'Hasil tugas tidak memenuhi kriteria penerimaan.');

      const res = await api.adminReviewTask(
        selectedSubmission.id,
        actionType,
        defaultNotes,
        reviewRating
      );

      if (res.success) {
        if (actionType === 'ACCEPT') {
          setReviewSuccessMessage(
            `✓ TUGAS BERHASIL DIKONFIRMASI! Saldo $${selectedSubmission.taskPaymentUSD.toFixed(2)} USD telah otomatis masuk ke wallet ${selectedSubmission.userDisplayName || selectedSubmission.userEmail}.`
          );
        } else if (actionType === 'REVISE') {
          setReviewSuccessMessage(
            `⟳ REVISI DIMINTA! Freelancer ${selectedSubmission.userDisplayName} telah diberitahu untuk merevisi tugas.`
          );
        } else {
          setReviewSuccessMessage(
            `✕ TUGAS DITOLAK! Status tugas diperbarui menjadi Ditolak.`
          );
        }

        await loadAdminData();
        setTimeout(() => {
          setSelectedSubmission(null);
          setReviewSuccessMessage('');
        }, 2200);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memproses konfirmasi tugas.');
    } finally {
      setProcessingReview(false);
    }
  };

  // Handler for Processing Withdrawal (Confirm & Pay, or Reject & Refund)
  const handleProcessWithdrawal = async (withdrawalId: string, action: 'PAY' | 'REJECT', reason?: string) => {
    setProcessingWithdrawal(true);
    setWithdrawalSuccessMessage('');
    try {
      const res = await api.processWithdrawal(withdrawalId, action, reason);
      if (res.success) {
        if (action === 'PAY') {
          setWithdrawalSuccessMessage(`✓ PENARIKAN DIKONFIRMASI & DITRANSFER! Payout berhasil disetujui.`);
        } else {
          setWithdrawalSuccessMessage(`✕ PENARIKAN DITOLAK! Saldo telah dikembalikan otomatis ke wallet pengguna.`);
        }
        await loadAdminData();
        setTimeout(() => {
          setSelectedWithdrawal(null);
          setWithdrawalSuccessMessage('');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memproses penarikan.');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const handleFinalizeChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWinnerId) return;
    setFinalizingChallenge(true);
    try {
      const res = await api.finalizeChallengeWinners(selectedWinnerId, selectedWinnerPrize);
      setChallengeSuccess(res.message);
      await loadAdminData();
      setTimeout(() => setChallengeSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to finalize challenge winners');
    } finally {
      setFinalizingChallenge(false);
    }
  };

  // Filtered Submissions
  const filteredSubmissions = assignments.filter((a) => {
    const matchStatus =
      submissionFilter === 'ALL'
        ? true
        : submissionFilter === 'SUBMITTED'
        ? ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)
        : a.status === submissionFilter;

    const matchSearch =
      !submissionSearch ||
      a.taskTitle.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      a.userDisplayName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(submissionSearch.toLowerCase());

    return matchStatus && matchSearch;
  });

  // Filtered Withdrawals
  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawalFilter === 'ALL') return true;
    return w.status === withdrawalFilter;
  });

  const pendingSubmissionsCount = assignments.filter((a) => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 font-mono">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 font-mono">
              ESCROW &amp; WALLET GUARANTEE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-2">
            WEJOBS Dashboard Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Konfirmasi hasil tugas pekerja &amp; klien, transfer saldo otomatis ke wallet, dan validasi penarikan dana.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="px-4 py-3.5 bg-[#141414] hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 font-mono"
            title="Refresh Database"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 font-mono"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>+ Buat Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Admin Quick Stat Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div
          onClick={() => setActiveTab('submissions')}
          className={`cursor-pointer p-5 border transition-all ${
            activeTab === 'submissions'
              ? 'bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/50'
              : 'bg-[#0c0c0c] border-white/10 hover:border-orange-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase">
            <span>Tugas Menunggu Konfirmasi</span>
            <FileCheck className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black text-orange-400 mt-2">{pendingSubmissionsCount}</div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mt-1">
            {pendingSubmissionsCount > 0 ? '⚠️ Butuh Verifikasi Admin' : 'Semua Bersih'}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('withdrawals')}
          className={`cursor-pointer p-5 border transition-all ${
            activeTab === 'withdrawals'
              ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50'
              : 'bg-[#0c0c0c] border-white/10 hover:border-emerald-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase">
            <span>Penarikan Menunggu Admin</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{pendingWithdrawalsCount}</div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mt-1">
            Min. $100.00 USD Payouts
          </span>
        </div>

        <div
          onClick={() => setActiveTab('stats')}
          className={`cursor-pointer p-5 border transition-all ${
            activeTab === 'stats'
              ? 'bg-white/10 border-white/40'
              : 'bg-[#0c0c0c] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase">
            <span>Total Payout Terbayar</span>
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats?.totalPaidOut || '$1,728,000.00+'}</div>
          <span className="text-[10px] text-emerald-400 uppercase font-bold block mt-1">Telah Dibayarkan</span>
        </div>

        <div
          onClick={() => setActiveTab('users')}
          className={`cursor-pointer p-5 border transition-all ${
            activeTab === 'users'
              ? 'bg-white/10 border-white/40'
              : 'bg-[#0c0c0c] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase">
            <span>Total Akun Terdaftar</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{users.length || 14221}</div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mt-1">Freelancers &amp; Clients</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 font-mono">
        {[
          {
            id: 'submissions',
            label: `Konfirmasi Tugas (${pendingSubmissionsCount} Pending)`,
            icon: FileCheck,
            highlight: pendingSubmissionsCount > 0,
          },
          {
            id: 'withdrawals',
            label: `Konfirmasi Penarikan (${pendingWithdrawalsCount} Pending)`,
            icon: Wallet,
            highlight: pendingWithdrawalsCount > 0,
          },
          { id: 'stats', label: 'Ringkasan & Statistik', icon: Briefcase },
          { id: 'users', label: `Daftar Pengguna (${users.length})`, icon: Users },
          { id: 'tasks', label: 'Katalog Tugas (4,421)', icon: Briefcase },
          { id: 'challenge', label: 'Hadiah Challenge Bulanan', icon: CreditCard },
          { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                active
                  ? 'bg-orange-500 text-black shadow-md'
                  : t.highlight
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/40 hover:bg-orange-500/20'
                  : 'bg-[#0c0c0c] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.highlight && !active && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: KONFIRMASI HASIL TUGAS / SUBMISSION APPROVAL QUEUE                */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Header & Filter Card */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 font-mono">
                    TASK DELIVERABLES VERIFICATION
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-display mt-2">
                  Konfirmasi Hasil Tugas &amp; Kredit Saldo Wallet
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Ketika pekerja freelance/klien mengumpulkan tugas, periksa hasil pekerjaannya di sini. Setelah Admin menekan <strong>"Konfirmasi &amp; Masukkan Saldo"</strong>, dana reward ($ USD) otomatis ditransfer ke wallet pekerja.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari tugas atau nama pekerja..."
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#050505] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10 font-mono text-xs">
              {[
                { id: 'SUBMITTED', label: `Menunggu Konfirmasi (${assignments.filter((a) => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length})` },
                { id: 'ALL', label: `Semua Tugas (${assignments.length})` },
                { id: 'ACCEPTED', label: `Disetujui & Masuk Wallet (${assignments.filter((a) => a.status === 'ACCEPTED').length})` },
                { id: 'REVISION_REQUESTED', label: `Minta Revisi (${assignments.filter((a) => a.status === 'REVISION_REQUESTED').length})` },
                { id: 'REJECTED', label: `Ditolak (${assignments.filter((a) => a.status === 'REJECTED').length})` },
                { id: 'IN_PROGRESS', label: `Sedang Dikerjakan (${assignments.filter((a) => a.status === 'IN_PROGRESS').length})` },
              ].map((f) => {
                const active = submissionFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSubmissionFilter(f.id)}
                    className={`px-4 py-2 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-orange-500 text-black'
                        : 'bg-[#141414] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submissions Table / Cards */}
          <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden font-mono">
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <FileCheck className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white uppercase">Tidak ada tugas dalam status ini</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Semua pengumpulan tugas telah diproses atau belum ada deliverable baru yang dikirimkan.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-white/10 uppercase text-[10px] font-black bg-[#080808]">
                    <tr>
                      <th className="py-4 px-4">ID &amp; Tanggal</th>
                      <th className="py-4 px-4">Pekerja Freelance</th>
                      <th className="py-4 px-4">Judul Tugas</th>
                      <th className="py-4 px-4">File / Deliverable</th>
                      <th className="py-4 px-4 text-center">Reward ($ USD)</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-right">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSubmissions.map((sub) => {
                      const isPending = ['SUBMITTED', 'UNDER_REVIEW'].includes(sub.status);
                      return (
                        <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                          {/* ID & Date */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-white block">{sub.id}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {sub.submittedAt
                                ? new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Belum dikirim'}
                            </span>
                            <span className="text-[9px] text-orange-400 uppercase font-black">
                              Versi #{sub.version || 1}
                            </span>
                          </td>

                          {/* Freelancer Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[11px] font-black text-orange-400 uppercase">
                                {sub.userDisplayName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <span className="font-bold text-white block font-sans">
                                  {sub.userDisplayName || 'Freelancer'}
                                </span>
                                <span className="text-[10px] text-slate-400 block">{sub.userEmail}</span>
                              </div>
                            </div>
                          </td>

                          {/* Task Title & Category */}
                          <td className="py-4 px-4 max-w-xs">
                            <span className="text-[10px] text-orange-400 font-bold uppercase block">
                              {sub.taskCategory}
                            </span>
                            <span className="font-medium text-white truncate block font-sans" title={sub.taskTitle}>
                              {sub.taskTitle}
                            </span>
                          </td>

                          {/* Deliverable File / Text snippet */}
                          <td className="py-4 px-4 max-w-xs">
                            {sub.fileName ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                                <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                <span className="truncate">{sub.fileName}</span>
                                <span className="text-[9px] text-slate-500 shrink-0">({sub.fileSize || 'Doc'})</span>
                              </div>
                            ) : sub.textSubmission ? (
                              <p className="text-slate-400 text-[11px] truncate italic">
                                "{sub.textSubmission.slice(0, 45)}..."
                              </p>
                            ) : (
                              <span className="text-slate-600 text-[11px]">Belum ada deliverable</span>
                            )}
                          </td>

                          {/* Reward USD */}
                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs">
                              +${sub.taskPaymentUSD.toFixed(2)} USD
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider inline-block ${
                                sub.status === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : sub.status === 'REVISION_REQUESTED'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : sub.status === 'REJECTED'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : isPending
                                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {sub.status === 'ACCEPTED'
                                ? '✓ Masuk Wallet'
                                : sub.status === 'REVISION_REQUESTED'
                                ? '⟳ Minta Revisi'
                                : sub.status === 'REJECTED'
                                ? '✕ Ditolak'
                                : isPending
                                ? 'Menunggu Konfirmasi'
                                : sub.status}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setReviewRating(5.0);
                                setReviewNotes(
                                  sub.status === 'ACCEPTED'
                                    ? sub.clientFeedback || 'Deliverable disetujui Admin.'
                                    : 'Deliverable lengkap dan sesuai instruksi. Reward USD telah dimasukkan ke wallet.'
                                );
                                setReviewSuccessMessage('');
                              }}
                              className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto ${
                                isPending
                                  ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-md shadow-orange-500/20'
                                  : 'bg-[#1a1a1a] hover:bg-white/10 text-slate-300 border border-white/10'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isPending ? 'Audit & Konfirmasi' : 'Detail Review'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: KONFIRMASI PENARIKAN SALDO / CASHOUT QUEUE                        */}
      {/* ========================================================================= */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-6">
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono">
                    FINANCIAL COMPLIANCE
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70 bg-white/5 border border-white/10 px-3 py-1 font-mono">
                    MIN. $100.00 USD
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-display mt-2">
                  Konfirmasi Penarikan Saldo (Cashout Queue)
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Setiap penarikan dana freelancer/klien wajib diverifikasi Admin. Klik <strong>"Konfirmasi &amp; Transfer"</strong> untuk menyelesaikan pembayaran, atau <strong>"Tolak"</strong> untuk mengembalikan dana ke saldo pengguna.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs">
                {[
                  { id: 'PENDING', label: `Menunggu Transfer (${withdrawals.filter((w) => w.status === 'PENDING').length})` },
                  { id: 'ALL', label: `Semua (${withdrawals.length})` },
                  { id: 'PAID', label: `Selesai Ditransfer (${withdrawals.filter((w) => w.status === 'PAID').length})` },
                  { id: 'REJECTED', label: `Ditolak (${withdrawals.filter((w) => w.status === 'REJECTED').length})` },
                ].map((f) => {
                  const active = withdrawalFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setWithdrawalFilter(f.id)}
                      className={`px-4 py-2 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#141414] text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Withdrawals Table */}
          <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden font-mono">
            {filteredWithdrawals.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Wallet className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white uppercase">Tidak ada antrian penarikan</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Semua permintaan penarikan telah disetujui atau belum ada permintaan baru.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-white/10 uppercase text-[10px] font-black bg-[#080808]">
                    <tr>
                      <th className="py-4 px-4">Req ID &amp; Waktu</th>
                      <th className="py-4 px-4">Nama Pemilik Akun</th>
                      <th className="py-4 px-4">Metode Pembayaran</th>
                      <th className="py-4 px-4">Detail Rekening / Wallet Tujuan</th>
                      <th className="py-4 px-4 text-center">Jumlah Penarikan</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-right">Aksi Konfirmasi Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-white block">{w.id}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {new Date(w.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-white block font-sans">{w.accountHolderName}</span>
                          <span className="text-[10px] text-slate-400 block">{w.userEmail}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-orange-400 font-bold uppercase text-[10px]">
                            {w.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs font-mono">
                          <span className="text-slate-200 block text-xs break-all">{w.destinationDetails}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-base font-black text-white block">
                            ${w.amount.toFixed(2)} USD
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider inline-block ${
                              w.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : w.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse'
                            }`}
                          >
                            {w.status === 'PAID'
                              ? '✓ Ditransfer'
                              : w.status === 'REJECTED'
                              ? '✕ Ditolak'
                              : 'Menunggu Konfirmasi'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {w.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleProcessWithdrawal(w.id, 'PAY')}
                                disabled={processingWithdrawal}
                                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase flex items-center gap-1 shadow-md shadow-emerald-500/20"
                                title="Konfirmasi & Kirim Transfer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Konfirmasi Transfer</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(w);
                                  setRejectionReason('Data rekening atau identitas tujuan tidak dapat diverifikasi.');
                                }}
                                disabled={processingWithdrawal}
                                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-black text-[10px] uppercase flex items-center gap-1 border border-rose-500/30"
                                title="Tolak dan Kembalikan Saldo"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              {w.status === 'PAID' ? 'Sudah Ditransfer' : 'Telah Ditolak & Refund'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: STATS OVERVIEW                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Tasks Seeded</span>
              <div className="text-3xl font-black text-white">{stats?.totalTasks || 4421}</div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">13 Categories</span>
            </div>
            <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Distributed</span>
              <div className="text-3xl font-black text-orange-400">{stats?.totalPaidOut || '$1,728,000.00+'}</div>
              <span className="text-[10px] text-emerald-400 font-black uppercase block">TELAH DI BAYARKAN</span>
            </div>
            <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active Freelancers</span>
              <div className="text-3xl font-black text-white">{stats?.registeredFreelancers || 14221}</div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">40+ Countries</span>
            </div>
            <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Completed Tasks</span>
              <div className="text-3xl font-black text-white">{stats?.completedTasks || 48210}</div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Verified Deliverables</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: USERS & WALLETS LEDGER                                            */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Registered Accounts &amp; Ledgers</h3>
            <span className="text-xs text-orange-400 font-bold">{users.length} Active Accounts</span>
          </div>
          <div className="overflow-x-auto font-mono">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-white/10 uppercase text-[10px] font-black bg-[#080808]">
                <tr>
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3 text-right">Available Balance</th>
                  <th className="py-3 px-3 text-right">Pending Payout</th>
                  <th className="py-3 px-3 text-right">Lifetime Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{u.id}</td>
                    <td className="py-3 px-3 font-bold text-white font-sans">{u.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 bg-white/5 text-[9px] font-bold text-orange-400 border border-orange-500/20 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{u.email}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      ${u.balanceAvailable.toFixed(2)} USD
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-orange-400">
                      ${u.balancePending.toFixed(2)} USD
                    </td>
                    <td className="py-3 px-3 text-right text-white font-bold">
                      ${u.balanceEarned.toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: TASK CATALOG (4,421 JOBS)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Task Catalog (Showing Sample)</h3>
            <span className="text-xs text-orange-400 font-bold">4,421 Deterministic Tasks</span>
          </div>
          <div className="overflow-x-auto font-mono">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-white/10 uppercase text-[10px] font-black bg-[#080808]">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Slots</th>
                  <th className="py-3 px-3 text-right">Reward (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tasks.slice(0, 30).map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{t.id}</td>
                    <td className="py-3 px-3 text-orange-400 font-bold uppercase text-[10px]">{t.category}</td>
                    <td className="py-3 px-3 text-white max-w-xs truncate font-medium font-sans">{t.title}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {t.remainingSlots}/{t.capacity}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-white">
                      ${t.paymentUSD.toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: MONTHLY CHALLENGE FINALIZATION                                    */}
      {/* ========================================================================= */}
      {activeTab === 'challenge' && (
        <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase text-white font-display">Challenge Prize Allocation</h3>
            <p className="text-xs text-slate-400">
              Disburse the $1,000 USD champion prize and award bonus ledger payouts to top ranked performers.
            </p>
          </div>

          <form onSubmit={handleFinalizeChallenge} className="max-w-lg space-y-4 p-6 bg-[#050505] border border-white/15 font-mono">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Select Champion Winner</label>
              <select
                required
                value={selectedWinnerId}
                onChange={(e) => setSelectedWinnerId(e.target.value)}
                className="w-full p-3 bg-[#0c0c0c] border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              >
                <option value="">-- Choose Ranked Freelancer --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) - Balance: ${u.balanceAvailable.toFixed(2)} USD
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Prize Allocation</label>
              <select
                value={selectedWinnerPrize}
                onChange={(e) => setSelectedWinnerPrize(e.target.value)}
                className="w-full p-3 bg-[#0c0c0c] border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              >
                <option value="$1,000 USD">$1,000 USD (1st Place Grand Prize)</option>
                <option value="$300 USD">$300 USD (2nd Place Elite Prize)</option>
                <option value="$150 USD">$150 USD (3rd Place Laureate)</option>
                <option value="$100 USD">$100 USD (Best Writer Award)</option>
              </select>
            </div>

            {challengeSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                ✓ {challengeSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={finalizingChallenge}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {finalizingChallenge ? 'Crediting Ledger...' : 'Disburse Prize to User Ledger'}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: AUDIT LOGS                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">System Security &amp; Ledger Audit Trail</h3>
            <span className="text-xs text-emerald-400 font-bold">100% Immutable</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-white/10 uppercase text-[10px] font-black bg-[#080808]">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{log.actor}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-orange-400 border border-orange-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{log.targetType || 'ENTITY'}</td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-sm">
                      {log.details || JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AUDIT & KONFIRMASI HASIL TUGAS (DELIVERABLE REVIEW)                 */}
      {/* ========================================================================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-white/20 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-mono">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-5 right-5 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 mb-6 border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Admin Task Deliverable Audit</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">
                Konfirmasi Hasil Tugas
              </h2>
              <p className="text-xs text-slate-400">
                Periksa deliverable pekerjaan. Setelah disetujui, saldo <strong>${selectedSubmission.taskPaymentUSD.toFixed(2)} USD</strong> langsung dikreditkan ke wallet freelancer.
              </p>
            </div>

            {/* Task & Submitter Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#050505] border border-white/10 p-4 mb-6 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Pekerja / Freelancer</span>
                <div className="font-bold text-white text-sm font-sans">{selectedSubmission.userDisplayName}</div>
                <div className="text-slate-400 text-[11px]">{selectedSubmission.userEmail}</div>
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase font-black">Reward USD (Escrow)</span>
                <div className="text-xl font-black text-emerald-400">
                  ${selectedSubmission.taskPaymentUSD.toFixed(2)} USD
                </div>
                <span className="text-[10px] text-orange-400 font-bold uppercase">{selectedSubmission.taskCategory}</span>
              </div>
            </div>

            {/* Task Deliverable Content */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Judul Tugas
                </label>
                <div className="p-3 bg-[#050505] border border-white/10 text-xs text-white font-sans font-bold">
                  {selectedSubmission.taskTitle}
                </div>
              </div>

              {/* Submitted Text */}
              {selectedSubmission.textSubmission && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Hasil Tulisan / Catatan Pekerja:
                  </label>
                  <div className="p-4 bg-[#050505] border border-white/10 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedSubmission.textSubmission}
                  </div>
                </div>
              )}

              {/* Attached File */}
              {selectedSubmission.fileName && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    File Lampiran Deliverable:
                  </label>
                  <div className="p-3 bg-[#050505] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white font-bold">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span>{selectedSubmission.fileName}</span>
                      <span className="text-[10px] text-slate-400">({selectedSubmission.fileSize || '1.4 MB'})</span>
                    </div>
                    <button
                      onClick={() => alert(`Simulasi Mengunduh File: ${selectedSubmission.fileName}`)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-orange-400 font-black text-[10px] uppercase flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Review Decision Controls */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1.5">
                  Rating Kualitas Hasil Tugas:
                </label>
                <div className="flex items-center gap-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className={`px-3 py-2 flex items-center gap-1 text-xs font-black transition-all ${
                        reviewRating === stars
                          ? 'bg-orange-500 text-black shadow-md'
                          : 'bg-[#050505] text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{stars}★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback / Admin Notes */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Catatan Admin / Feedback untuk Pekerja:
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Tuliskan catatan apresiasi atau detail yang perlu direvisi..."
                  className="w-full p-3 bg-[#050505] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              {/* Success Alert */}
              {reviewSuccessMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                  {reviewSuccessMessage}
                </div>
              )}

              {/* 3 Decision Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  disabled={processingReview}
                  onClick={() => handleConfirmTaskDeliverable('ACCEPT')}
                  className="py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{processingReview ? 'Memproses...' : '✓ Konfirmasi & Kredit Saldo'}</span>
                </button>

                <button
                  type="button"
                  disabled={processingReview}
                  onClick={() => handleConfirmTaskDeliverable('REVISE')}
                  className="py-4 px-4 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-black text-xs uppercase tracking-wider border border-amber-500/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>⟳ Minta Revisi</span>
                </button>

                <button
                  type="button"
                  disabled={processingReview}
                  onClick={() => handleConfirmTaskDeliverable('REJECT')}
                  className="py-4 px-4 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-black text-xs uppercase tracking-wider border border-rose-500/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>✕ Tolak Tugas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECT WITHDRAWAL DIALOG                                           */}
      {/* ========================================================================= */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-rose-500/30 p-6 sm:p-8 shadow-2xl font-mono">
            <button
              onClick={() => setSelectedWithdrawal(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tolak Penarikan Dana</span>
              </div>
              <h3 className="text-xl font-black uppercase text-white font-display">Tolak &amp; Refund Saldo</h3>
              <p className="text-xs text-slate-400">
                Dana sebesar <strong>${selectedWithdrawal.amount.toFixed(2)} USD</strong> akan otomatis dikembalikan ke saldo wallet <strong>{selectedWithdrawal.userName}</strong>.
              </p>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Alasan Penolakan:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 bg-[#050505] border border-white/15 text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
                />
              </div>

              {withdrawalSuccessMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                  {withdrawalSuccessMessage}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={processingWithdrawal}
                onClick={() => handleProcessWithdrawal(selectedWithdrawal.id, 'REJECT', rejectionReason)}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-md shadow-rose-500/20"
              >
                {processingWithdrawal ? 'Memproses...' : 'Konfirmasi Tolak & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
