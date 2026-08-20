import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Send,
  X,
} from 'lucide-react';
import { SupportTicket, User } from '../types';
import { api } from '../lib/api';

interface HelpCenterPageProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ currentUser, onOpenAuth }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New ticket fields
  const [category, setCategory] = useState<'Payment' | 'Task' | 'Account' | 'Technical' | 'Other'>('Payment');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getSupportTickets(currentUser.id);
      setTickets(data);
      if (data.length > 0 && !activeTicket) {
        setActiveTicket(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [currentUser]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      const ticket = await api.createSupportTicket({
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        category,
        subject,
        description,
        priority,
      });
      setTickets((prev) => [ticket, ...prev]);
      setActiveTicket(ticket);
      setCreateModalOpen(false);
      setSubject('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !newMsg.trim() || !currentUser) return;
    try {
      const updated = await api.replySupportTicket(
        activeTicket.id,
        currentUser.name,
        newMsg.trim(),
        false
      );
      setActiveTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setNewMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Log in to Access Support Help Desk</h2>
        <p className="text-xs text-gray-400">Open support tickets, chat with compliance specialists, and track ticket status.</p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Help Center & Support Desk</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            24/7 dedicated assistance for task queries, withdrawal verification, and dispute resolution.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Column: Tickets List (4 cols) */}
        <div className="lg:col-span-4 bg-[#161616] border border-white/5 rounded-3xl p-5 space-y-3 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">My Tickets ({tickets.length})</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[520px]">
            {tickets.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-12">No support tickets opened yet.</p>
            ) : (
              tickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30'
                        : 'bg-[#0a0a0a] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">{t.category}</span>
                      <span
                        className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{t.subject}</h4>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>{t.id}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Messaging Thread (8 cols) */}
        <div className="lg:col-span-8 bg-[#161616] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
          {activeTicket ? (
            <>
              {/* Ticket Top Meta */}
              <div className="pb-4 border-b border-white/5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                      {activeTicket.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{activeTicket.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{activeTicket.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-semibold text-gray-300 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Priority: {activeTicket.priority}
                  </span>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto space-y-3 py-2 max-h-[360px]">
                {activeTicket.messages.map((m) => {
                  const isOfficial = m.isStaff || m.senderRole === 'SUPPORT';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isOfficial ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-500">
                        <span className="font-semibold text-gray-300">{m.senderName}</span>
                        {isOfficial && (
                          <span className="bg-indigo-600 text-white font-bold px-1.5 rounded text-[8px]">
                            OFFICIAL
                          </span>
                        )}
                        <span>{new Date(m.timestamp || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-4 rounded-2xl text-xs max-w-md leading-relaxed ${
                          isOfficial
                            ? 'bg-[#0a0a0a] border border-white/10 text-gray-200'
                            : 'bg-indigo-600 text-white font-medium shadow-sm'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message or response to support team..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="py-24 text-center text-xs text-gray-500">
              Select a ticket on the left or create a new support inquiry.
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Open a New Support Ticket</h3>
            <p className="text-xs text-gray-400 mb-5">Our support engineers and review officers respond within 2-6 hours.</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Payment">Payment / Withdrawal ($100 USD)</option>
                    <option value="Task">Task Assignment & Review</option>
                    <option value="Account">Account & Profile Verification</option>
                    <option value="Technical">Technical / Bug Report</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">Low (General)</option>
                    <option value="MEDIUM">Medium (Standard)</option>
                    <option value="HIGH">High (Urgent Issue)</option>
                    <option value="URGENT">Urgent (Blocked Payout)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding Task ID #TASK-0012 revision"
                  className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all relevant details, URLs, transaction hashes, or error logs..."
                  className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
