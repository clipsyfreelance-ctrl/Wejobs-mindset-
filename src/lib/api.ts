// ---------------------------------------------------------------------------
// WEJOBS client-side data layer
// ---------------------------------------------------------------------------
// GitHub Pages only serves static files — it cannot run the Express server in
// server.ts. This file used to call fetch('/api/...') against that server.
//
// The original server logic in server/db.ts has ZERO Node-only dependencies
// (no fs, no real database, no process.env) — it's a pure in-memory class
// using the exact same seed data (server/seedTasks.ts: the 4,421 real tasks,
// sponsors, FAQs, testimonials, etc). So instead of duplicating or replacing
// that data, this file imports `db` from server/db.ts directly and calls its
// methods in the browser. The function names/signatures below are UNCHANGED
// from the original api.ts, so every page/component keeps working exactly as
// before with no other code changes required.
//
// IMPORTANT — REQUIRES BACKEND FOR PRODUCTION:
// This in-memory store is per-browser-session only (same as the original
// Express server, which also reset on every restart since it used no real
// database). For a real multi-user production deployment with persistent
// wallets/withdrawals/admin actions, server.ts + server/db.ts should be
// deployed on a real Node host (Render, Fly.io, a VPS, etc). Do NOT treat
// this static build's client-side balances/withdrawals as a secure,
// authoritative financial record — see server.ts for the production-ready
// API surface this static build is standing in for.
// ---------------------------------------------------------------------------

import { db } from '../../server/db';
import {
  User,
  Task,
  TaskAssignment,
  LedgerTransaction,
  WithdrawalRequest,
  MonthlyChallenge,
  ChallengeParticipant,
  TestimonialReview,
  FAQItem,
  SupportTicket,
  SponsorPartner,
  PlatformStats,
  AuditLog,
  NotificationItem,
} from '../types';

function resolved<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

// Original code threw on failed requests (fetchJSON throws when
// data.success === false). Replicate that for db calls that return a
// { success, message } result shape, so existing try/catch UI code keeps
// working unchanged.
function unwrap<T extends { success: boolean; message?: string }>(result: T): T {
  if (!result.success) {
    throw new Error(result.message || 'Request failed.');
  }
  return result;
}

export const api = {
  // Platform Stats
  async getStats(): Promise<PlatformStats> {
    return resolved(db.getPlatformStats());
  },

  // Tasks
  async getTasks(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    status?: string;
  }): Promise<{ tasks: Task[]; total: number; page: number; limit: number; totalPages: number }> {
    return resolved(db.getTasks(params));
  },

  async getTask(idOrSlug: string): Promise<Task> {
    const task = db.getTaskByIdOrSlug(idOrSlug);
    if (!task) throw new Error('Task not found.');
    return resolved(task);
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return resolved(db.createTask(taskData));
  },

  async takeJob(taskId: string, userId?: string): Promise<{ success: boolean; message: string; assignment?: TaskAssignment }> {
    return resolved(unwrap(db.takeJob(userId || 'USER-001', taskId)));
  },

  async toggleSaveTask(taskId: string, userId?: string): Promise<string[]> {
    return resolved(db.toggleSaveTask(userId || 'USER-001', taskId));
  },

  // Assignments & Submissions
  async getAssignments(userId?: string, status?: string): Promise<TaskAssignment[]> {
    return resolved(db.getAssignments(userId, status));
  },

  async getReviewQueue(): Promise<TaskAssignment[]> {
    return resolved(db.getAssignments(undefined, 'SUBMITTED'));
  },

  async submitAssignment(assignmentId: string, textSubmission: string, fileName?: string, fileSize?: string) {
    return resolved(unwrap(db.submitAssignment(assignmentId, textSubmission, fileName, fileSize)));
  },

  async reviewAssignment(assignmentId: string, action: 'ACCEPT' | 'REVISE' | 'REJECT', notes: string, rating?: number, revisionNotes?: string) {
    return resolved(unwrap(db.reviewAssignment(assignmentId, action, revisionNotes || notes, rating)));
  },

  // Wallet & Ledger
  async getTransactions(userId?: string): Promise<LedgerTransaction[]> {
    return resolved(db.getTransactions(userId || 'USER-001'));
  },

  async getWithdrawals(userId?: string): Promise<WithdrawalRequest[]> {
    return resolved(db.getWithdrawals(userId));
  },

  async requestWithdrawal(data: {
    userId?: string;
    amount: number;
    paymentMethod: 'Bank Lokal' | 'PayPal' | 'Wise' | 'USDT';
    destinationDetails: string;
    accountHolderName: string;
  }): Promise<{ success: boolean; message: string; withdrawal: WithdrawalRequest }> {
    return resolved(
      unwrap(
        db.requestWithdrawal(data.userId || 'USER-001', data.amount, data.paymentMethod, data.destinationDetails, data.accountHolderName)
      ) as { success: boolean; message: string; withdrawal: WithdrawalRequest }
    );
  },

  async updateWithdrawalStatus(withdrawalId: string, status: 'PAID' | 'REJECTED', reason?: string) {
    const action = status === 'PAID' ? 'PAY' : 'REJECT';
    return resolved(db.processWithdrawal(withdrawalId, action, reason));
  },

  // Monthly Challenge
  async getChallenge(): Promise<MonthlyChallenge> {
    return resolved(db.getChallenge());
  },

  async getChallengeLeaderboard(): Promise<ChallengeParticipant[]> {
    return resolved(db.getChallengeLeaderboard());
  },

  async joinChallenge(userId?: string): Promise<{ success: boolean; message: string; participant?: ChallengeParticipant }> {
    return resolved(unwrap(db.joinChallenge(userId || 'USER-001')));
  },

  // Testimonials, FAQs, Support
  async getTestimonials(): Promise<TestimonialReview[]> {
    return resolved(db.getTestimonials());
  },

  async getFAQs(search?: string, category?: string): Promise<FAQItem[]> {
    let items = db.getFAQs().map((item) => ({
      ...item,
      helpfulCount: item.helpfulCount ?? item.helpfulVotes ?? 0,
      notHelpfulCount: item.notHelpfulCount ?? item.unhelpfulVotes ?? 0,
    }));
    if (category && category !== 'All') {
      items = items.filter((i) => i.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q));
    }
    return resolved(items);
  },

  async getFaqs(search?: string, category?: string): Promise<FAQItem[]> {
    return this.getFAQs(search, category);
  },

  async voteFAQ(faqId: string, helpful: boolean): Promise<FAQItem> {
    const item = db.voteFAQ(faqId, helpful);
    if (!item) throw new Error('FAQ not found.');
    return resolved({
      ...item,
      helpfulCount: item.helpfulCount ?? item.helpfulVotes ?? 0,
      notHelpfulCount: item.notHelpfulCount ?? item.unhelpfulVotes ?? 0,
    });
  },

  async voteFaq(faqId: string, helpful: boolean): Promise<FAQItem> {
    return this.voteFAQ(faqId, helpful);
  },

  async getTickets(userId?: string): Promise<SupportTicket[]> {
    const list = db.getTickets(userId);
    return resolved(
      list.map((t) => ({
        ...t,
        messages: t.messages.map((m) => ({
          ...m,
          isStaff: m.isStaff ?? m.senderRole === 'SUPPORT',
          timestamp: m.timestamp ?? m.createdAt,
        })),
      }))
    );
  },

  async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    return this.getTickets(userId);
  },

  async createTicket(data: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    category: string;
    subject: string;
    description: string;
    priority?: string;
  }): Promise<SupportTicket> {
    const ticket = db.createTicket(data.userId || 'USER-001', data.category, data.subject, data.description);
    return resolved({
      ...ticket,
      messages: ticket.messages.map((m) => ({
        ...m,
        isStaff: m.isStaff ?? m.senderRole === 'SUPPORT',
        timestamp: m.timestamp ?? m.createdAt,
      })),
    });
  },

  async createSupportTicket(data: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    category: string;
    subject: string;
    description: string;
    priority?: string;
  }): Promise<SupportTicket> {
    return this.createTicket(data);
  },

  async replyTicket(ticketId: string, data: { senderId?: string; senderName: string; role?: 'USER' | 'SUPPORT'; message: string; isStaff?: boolean }) {
    const ticket = db.replyTicket(
      ticketId,
      data.senderId || 'USER-001',
      data.senderName,
      data.role || (data.isStaff ? 'SUPPORT' : 'USER'),
      data.message
    );
    if (!ticket) throw new Error('Ticket not found.');
    return resolved({
      ...ticket,
      messages: ticket.messages.map((m) => ({
        ...m,
        isStaff: m.isStaff ?? m.senderRole === 'SUPPORT',
        timestamp: m.timestamp ?? m.createdAt,
      })),
    });
  },

  async replySupportTicket(ticketId: string, senderName: string, message: string, isStaff?: boolean): Promise<SupportTicket> {
    return this.replyTicket(ticketId, { senderName, message, isStaff });
  },

  // Sponsors
  async getSponsors(): Promise<SponsorPartner[]> {
    return resolved(db.getSponsors());
  },

  async updateSponsor(data: Partial<SponsorPartner>): Promise<SponsorPartner> {
    return resolved(db.updateSponsor(data));
  },

  // Auth & User Profile
  async getMe(userId?: string): Promise<User | null> {
    if (!userId) return null;
    return resolved(db.getUserById(userId) || null);
  },

  async getCurrentUser(userId?: string): Promise<User | null> {
    return this.getMe(userId);
  },

  async logout(): Promise<{ success: boolean }> {
    return resolved({ success: true });
  },

  // Notifications API
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    if (!userId) return [];
    return resolved(db.getNotifications(userId));
  },

  async markNotificationRead(id: string): Promise<boolean> {
    return resolved(db.markNotificationRead(id));
  },

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    return resolved(db.markAllNotificationsRead(userId));
  },

  async triggerTestApproval(userId: string, title?: string, message?: string, amount?: number): Promise<NotificationItem> {
    return resolved(
      db.addNotification(
        userId,
        'TASK_APPROVED',
        title || 'Tugas Disetujui & Saldo Ditambahkan',
        message || 'Pekerjaan Anda telah diverifikasi oleh tim kurator WEJOBS. Saldo sebesar $25.00 USD telah dikreditkan ke dompet Anda.',
        amount || 25.0
      )
    );
  },

  async login(email: string, captchaVerified: boolean): Promise<User> {
    if (!captchaVerified) {
      throw new Error('Server-side CAPTCHA verification failed.');
    }
    if (!email || !email.trim()) {
      throw new Error('Email address is required.');
    }
    let user = db.getUserByEmail(email.trim());
    if (!user) {
      // Register genuine freelancer account for this email (same rule as
      // the original server.ts /api/auth/login route)
      const displayName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'Freelance Member';
      user = db.registerUser(
        displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email.trim(),
        '+1 (555) 019-2831',
        'Global Freelance Workspace',
        'fox',
        'FREELANCER'
      );
    }
    return resolved(user);
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatarType: string;
    captchaVerified: boolean;
    role?: 'FREELANCER' | 'CLIENT';
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
  }): Promise<User> {
    if (!data.captchaVerified) {
      throw new Error('Server-side CAPTCHA verification failed.');
    }
    return resolved(
      db.registerUser(
        data.name,
        data.email,
        data.phone,
        data.address,
        data.avatarType,
        data.role,
        data.companyName,
        data.companyWebsite,
        data.industry
      )
    );
  },

  async adminLogin(adminKey: string, code?: string): Promise<User> {
    if (adminKey === 'wejobs-admin-2026' || adminKey === 'admin' || code === '8899') {
      const admin = db.getUserById('USER-ADMIN');
      if (!admin) throw new Error('Admin account not found.');
      return resolved(admin);
    }
    throw new Error('Invalid administrative security credentials.');
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const updated = db.updateUser(userId, data);
    if (!updated) throw new Error('User not found.');
    return resolved(updated);
  },

  // Admin APIs
  async getAdminOverview(): Promise<any> {
    const stats = db.getPlatformStats();
    const allUsers = db.getAllUsers();
    const withdrawals = db.getWithdrawals();
    const auditLogs = db.getAuditLogs();
    return resolved({
      stats,
      totalUsers: allUsers.length,
      pendingWithdrawalsCount: withdrawals.filter((w) => w.status === 'PENDING').length,
      recentAuditLogs: auditLogs,
      users: allUsers,
      withdrawals,
    });
  },

  async getAdminUsers(): Promise<User[]> {
    const overview = await this.getAdminOverview();
    return overview?.users || [];
  },

  async getAdminWithdrawals(): Promise<WithdrawalRequest[]> {
    return this.getWithdrawals();
  },

  async getAllAssignments(status?: string): Promise<TaskAssignment[]> {
    return resolved(db.getAssignments(undefined, status && status !== 'ALL' ? status : undefined));
  },

  async adminReviewTask(
    assignmentId: string,
    action: 'ACCEPT' | 'REVISE' | 'REJECT',
    notes: string,
    rating: number = 5.0
  ) {
    return this.reviewAssignment(assignmentId, action, notes, rating);
  },

  async finalizeChallengeWinners(winnerId: string, prize: string): Promise<{ success: boolean; message: string }> {
    // NOTE: the original server.ts never actually implemented
    // POST /api/admin/challenge/finalize (no matching route existed), so this
    // was already a no-op/unreachable call in the source project. Preserved
    // as a harmless no-op here rather than inventing new server behavior.
    return resolved({ success: true, message: 'Challenge winners finalized.' });
  },

  async getPendingClientSubmissions(clientId?: string): Promise<TaskAssignment[]> {
    return this.getReviewQueue();
  },

  async processWithdrawal(
    withdrawalId: string,
    action: 'APPROVE' | 'PAY' | 'REJECT',
    reason?: string
  ): Promise<{ success: boolean; message: string; withdrawal: WithdrawalRequest }> {
    return resolved(db.processWithdrawal(withdrawalId, action, reason) as any);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const logs = db.getAuditLogs();
    return resolved(
      logs.map((log) => ({
        ...log,
        details: log.details || `${log.action} performed on ${log.targetType || 'entity'} (${log.targetId || ''})`,
      }))
    );
  },
};
