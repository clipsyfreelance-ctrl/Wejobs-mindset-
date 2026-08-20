import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  X,
  ExternalLink,
  CheckCheck,
  Send,
} from 'lucide-react';
import { NotificationItem, User } from '../types';
import { api } from '../lib/api';

interface NotificationCenterProps {
  currentUser: User | null;
  onNavigate?: (tab: string, subId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const data = await api.getNotifications(currentUser.id);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Poll every 8 seconds for real-time admin approvals
      const interval = setInterval(fetchNotifications, 8000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [currentUser?.id]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    try {
      await api.markAllNotificationsRead(currentUser.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleTriggerTestApproval = async () => {
    if (!currentUser) return;
    setTestSending(true);
    try {
      const newNotif = await api.triggerTestApproval(
        currentUser.id,
        'Pekerjaan Disetujui Admin (Auto-Credit)',
        'Selamat! Tugas artikel Anda telah diperiksa dan disetujui kurator WEJOBS. Saldo $25.00 USD langsung masuk ke dompet.',
        25.0
      );
      setNotifications((prev) => [newNotif, ...prev]);
    } catch (err) {
      console.error('Failed to trigger test approval:', err);
    } finally {
      setTestSending(false);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'TASK_APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'WITHDRAWAL_PAID':
        return <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'TASK_REVISION':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'WITHDRAWAL_REJECTED':
      case 'TASK_REJECTED':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMin / 60);

      if (diffMin < 1) return 'Baru saja';
      if (diffMin < 60) return `${diffMin}m lalu`;
      if (diffHours < 24) return `${diffHours}j lalu`;
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pusat Notifikasi Persetujuan"
        className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
          isOpen
            ? 'bg-orange-500/15 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10'
            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-black ring-2 ring-[#0c0c0c] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0f0f12] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-orange-400" />
                Notifikasi Persetujuan
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  title="Tandai semua dibaca"
                  className="p-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-semibold">Semua Dibaca</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-300">Belum Ada Notifikasi</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Tindakan persetujuan tugas & pencairan saldo dari Admin akan muncul seketika di sini.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) handleMarkAsRead(notif.id);
                    if (notif.taskId && onNavigate) onNavigate('my-tasks');
                    if (notif.withdrawalId && onNavigate) onNavigate('wallet');
                  }}
                  className={`p-3.5 sm:p-4 flex gap-3 transition-colors cursor-pointer text-left relative ${
                    notif.read ? 'bg-transparent hover:bg-white/5' : 'bg-orange-500/[0.04] hover:bg-orange-500/[0.08]'
                  }`}
                >
                  {/* Icon */}
                  <div className="pt-0.5">{getIcon(notif.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          notif.read ? 'text-slate-300' : 'text-white'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed break-words font-normal">
                      {notif.message}
                    </p>

                    {/* Amount Highlight if present */}
                    {notif.amount && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-extrabold">
                        <span>+${notif.amount.toFixed(2)} USD</span>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5 shadow-sm shadow-orange-500" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with Quick Action / Test Trigger */}
          <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={testSending}
              onClick={handleTriggerTestApproval}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{testSending ? 'Mengirim...' : 'Tes Notifikasi Admin'}</span>
            </button>

            <span className="text-[10px] text-slate-500 font-mono">
              WEJOBS Realtime Sync
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
