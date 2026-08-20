import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText,
  Share2,
  Zap,
} from 'lucide-react';
import { Task, User } from '../types';
import { api } from '../lib/api';

interface TaskDetailPageProps {
  task: Task;
  currentUser: User | null;
  onBack: () => void;
  onTakeSuccess: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  currentUser,
  onBack,
  onTakeSuccess,
  onOpenAuth,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const isFull = task.remainingSlots <= 0 || task.status === 'FULL';

  const handleTakeJob = async () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.takeJob(task.id, currentUser.id);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onTakeSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to claim task.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Back button & top utilities */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0c] hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0c0c0c] border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors font-mono"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-[#0c0c0c] border border-white/15 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
              <span className="font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1">
                {task.category}
              </span>
              <span className="font-bold uppercase text-slate-300 bg-white/5 border border-white/10 px-3 py-1">
                {task.subtype}
              </span>
              <span className="font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                {task.difficulty}
              </span>
              <span className="text-slate-500 font-bold">
                REF: {task.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display leading-tight">
              {task.title}
            </h1>

            {/* Client info bar */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-white font-bold flex items-center gap-1.5 font-sans">
                Client: {task.clientDisplayName}
                {task.clientVerified && <ShieldCheck className="w-4 h-4 text-orange-400" />}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 text-orange-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{task.clientRating.toFixed(1)} Rating</span>
              </div>
              <span>•</span>
              <span className="uppercase">{task.language}</span>
            </div>
          </div>

          {/* Right Price & Claim Action Box */}
          <div className="bg-[#050505] border border-white/15 p-6 lg:w-80 flex flex-col justify-between space-y-5 flex-shrink-0 shadow-lg">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">
                Disbursement Amount
              </span>
              <div className="text-3xl font-black text-white mt-1 font-mono">
                ${task.paymentUSD.toFixed(2)}{' '}
                <span className="text-xs text-orange-400 font-bold uppercase">USD</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">{task.paymentBasis}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-white/10 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Est. Time:</span>
                <strong className="text-white font-bold">{task.estimatedCompletionTime}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Deadline:</span>
                <strong className="text-white font-bold">{task.deadline}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Slots:</span>
                <strong className={isFull ? 'text-rose-400' : 'text-orange-400'}>
                  {isFull ? 'FULL (0)' : `${task.remainingSlots} / ${task.capacity}`}
                </strong>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-mono">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold font-mono">
                ✓ {successMsg}
              </div>
            )}

            <button
              onClick={handleTakeJob}
              disabled={loading || isFull}
              className={`w-full py-4 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isFull
                  ? 'bg-[#1c1c1c] text-slate-500 cursor-not-allowed border border-white/10'
                  : 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 active:scale-95'
              }`}
            >
              {loading ? (
                'Reserving Slot...'
              ) : isFull ? (
                'SLOTS EXHAUSTED'
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Take Job (Lock Slot)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Structured Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Brief & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objective & Description */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>OBJECTIVE & TARGET AUDIENCE</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {task.taskObjective}
            </p>
            <div className="pt-2 font-mono">
              <span className="text-xs text-slate-500 uppercase font-bold">Target Audience: </span>
              <span className="text-xs text-white font-bold">{task.targetAudience}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {task.description}
            </p>
          </div>

          {/* Detailed Instructions */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>STEP-BY-STEP INSTRUCTIONS</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {task.detailedInstructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-orange-500 font-bold font-mono">[{i + 1}]</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables & Formatting */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
              DELIVERABLE REQUIREMENTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#050505] border border-white/10">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Volume / Length:</span>
                <strong className="text-white">{task.wordCountOrUnit}</strong>
              </div>
              <div className="p-4 bg-[#050505] border border-white/10">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Format:</span>
                <strong className="text-white">{task.requiredFormat}</strong>
              </div>
              <div className="p-4 bg-[#050505] border border-white/10">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Style & Tone:</span>
                <strong className="text-white">{task.writingStyle || 'Editorial'} • {task.tone || 'Professional'}</strong>
              </div>
              <div className="p-4 bg-[#050505] border border-white/10">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Upload Formats:</span>
                <strong className="text-white">{task.allowedFileTypes.join(', ').toUpperCase()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quality Rules, Forbidden Items & Revision Policy */}
        <div className="space-y-6">
          {/* Acceptance Criteria */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
              <CheckCircle className="w-4 h-4" />
              <span>ACCEPTANCE CRITERIA</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {task.acceptanceCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold font-mono">✓</span>
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Forbidden Items */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4" />
              <span>FORBIDDEN PRACTICES</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {task.forbiddenItems.map((forb, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold font-mono">✗</span>
                  <span>{forb}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plagiarism & Revision Policy */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 font-mono">Originality Policy:</span>
              <p className="text-slate-300">{task.plagiarismRule}</p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 font-mono">Revision Policy:</span>
              <p className="text-slate-300">{task.revisionPolicy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

