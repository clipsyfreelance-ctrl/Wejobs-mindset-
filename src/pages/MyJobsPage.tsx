import React, { useState, useEffect } from 'react';
import {
  Clock,
  Upload,
  FileText,
  Send,
  Star,
  X,
} from 'lucide-react';
import { TaskAssignment, User } from '../types';
import { api } from '../lib/api';

interface MyJobsPageProps {
  currentUser: User | null;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const MyJobsPage: React.FC<MyJobsPageProps> = ({
  currentUser,
  onSelectTab,
  onOpenAuth,
}) => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Active submission modal state
  const [selectedAsgn, setSelectedAsgn] = useState<TaskAssignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  const loadAssignments = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getAssignments(currentUser.id, statusFilter);
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [currentUser, statusFilter]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Log in to view your assignments</h2>
        <p className="text-xs text-gray-400">Track in-progress tasks, upload deliverables, and view review feedback.</p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleOpenSubmitModal = (asgn: TaskAssignment) => {
    setSelectedAsgn(asgn);
    setSubmissionText(asgn.textSubmission || '');
    setAttachedFileName(asgn.fileName || '');
    setModalSuccess('');
    setModalError('');
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgn) return;
    if (!submissionText.trim() && !attachedFileName) {
      setModalError('Please write your deliverable text or attach a file.');
      return;
    }

    setSubmitting(true);
    setModalError('');
    setModalSuccess('');

    try {
      const res = await api.submitAssignment(
        selectedAsgn.id,
        submissionText,
        attachedFileName || undefined,
        attachedFileName ? '1.4 MB' : undefined
      );
      if (res.success) {
        setModalSuccess('Hasil tugas berhasil dikumpulkan! Menunggu konfirmasi Admin/Klien. Saldo reward ($ USD) otomatis masuk ke wallet setelah disetujui.');
        setTimeout(() => {
          setSelectedAsgn(null);
          loadAssignments();
        }, 1500);
      }
    } catch (err: any) {
      setModalError(err.message || 'Failed to submit deliverable.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'SUBMITTED', label: 'Under Review' },
    { id: 'REVISION_REQUESTED', label: 'Revision Requested' },
    { id: 'ACCEPTED', label: 'Accepted & Paid' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Task Assignments</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your claimed micro-tasks, submit deliverables, and respond to revisions.
          </p>
        </div>
        <button
          onClick={() => onSelectTab('jobs')}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          Find More Tasks
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const active = statusFilter === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#161616] text-gray-400 border border-white/5 hover:text-white hover:border-white/15'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading your assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="py-20 bg-[#161616] border border-white/5 rounded-3xl text-center space-y-3 p-6">
          <FileText className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No assignments in this filter</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Browse our 4,421 task catalog to claim an assignment and start working.
          </p>
          <button
            onClick={() => onSelectTab('jobs')}
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white"
          >
            Browse Task Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((asgn) => {
            return (
              <div
                key={asgn.id}
                className="bg-[#161616] border border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full">
                      {asgn.taskCategory}
                    </span>
                    {/* Status Badges */}
                    {asgn.status === 'IN_PROGRESS' && (
                      <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        IN PROGRESS
                      </span>
                    )}
                    {asgn.status === 'SUBMITTED' && (
                      <span className="text-[10px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                        UNDER CLIENT REVIEW
                      </span>
                    )}
                    {asgn.status === 'REVISION_REQUESTED' && (
                      <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                        REVISION REQUESTED
                      </span>
                    )}
                    {asgn.status === 'ACCEPTED' && (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        ACCEPTED & CREDITED
                      </span>
                    )}
                    {asgn.status === 'REJECTED' && (
                      <span className="text-[10px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                        REJECTED
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-mono">
                      v{asgn.version}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{asgn.taskTitle}</h3>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Deadline: <strong className="text-gray-200">{asgn.taskDeadline}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-gray-500">ID: {asgn.id}</span>
                  </div>

                  {/* Feedback / Revision Notes Banner */}
                  {asgn.status === 'REVISION_REQUESTED' && asgn.revisionNotes && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                      <strong>Client Feedback / Revision Request:</strong> {asgn.revisionNotes}
                    </div>
                  )}

                  {asgn.status === 'ACCEPTED' && asgn.clientFeedback && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-center justify-between">
                      <span><strong>Client Review:</strong> {asgn.clientFeedback}</span>
                      {asgn.ratingGiven && (
                        <span className="flex items-center gap-1 font-bold text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {asgn.ratingGiven.toFixed(1)} ★
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action & Reward Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Reward</span>
                    <span className="text-xl font-black text-white">
                      ${asgn.taskPaymentUSD.toFixed(2)}{' '}
                      <span className="text-xs text-indigo-400 font-medium">USD</span>
                    </span>
                  </div>

                  {/* Submit / Edit Deliverable Button */}
                  {(asgn.status === 'IN_PROGRESS' || asgn.status === 'REVISION_REQUESTED') && (
                    <button
                      onClick={() => handleOpenSubmitModal(asgn)}
                      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{asgn.status === 'REVISION_REQUESTED' ? 'Resubmit Work' : 'Submit Deliverable'}</span>
                    </button>
                  )}

                  {asgn.status === 'SUBMITTED' && (
                    <span className="text-xs text-gray-400 italic">
                      In review queue...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAsgn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAsgn(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Submission Workflow</span>
              <h3 className="text-lg font-bold text-white">{selectedAsgn.taskTitle}</h3>
              <p className="text-xs text-gray-400">
                Provide your written response below or upload your formatted document deliverable.
              </p>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              {/* Text Submission Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Deliverable Text Content (Formatted Text / Markdown)
                </label>
                <textarea
                  rows={8}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste or write your full deliverable here..."
                  className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>Zero-Plagiarism validation enabled</span>
                  <span>{submissionText.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Or Attach Document File (.docx, .pdf, .txt, .md)
                </label>
                <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-dashed border-white/15 hover:border-indigo-500/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-indigo-400" />
                    <div>
                      <span className="text-xs font-medium text-white block">
                        {attachedFileName || 'Choose or drag document deliverable'}
                      </span>
                      <span className="text-[10px] text-gray-500">Max file size: 15MB</span>
                    </div>
                  </div>
                  <label className="px-4 py-2 rounded-full bg-white/10 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer">
                    Browse File
                    <input
                      type="file"
                      accept=".docx,.pdf,.txt,.md,.json,.csv"
                      onChange={handleFileAttach}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {modalError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
                  ✓ {modalSuccess}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedAsgn(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Send for Client Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
