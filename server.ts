import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // --- API Routes ---

  // Platform Statistics
  app.get('/api/stats', (req, res) => {
    try {
      const stats = db.getPlatformStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Task Catalog & Discovery
  app.get('/api/tasks', (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category,
        difficulty,
        minPrice,
        maxPrice,
        sortBy,
        status,
      } = req.query;

      const result = db.getTasks({
        page: Number(page),
        limit: Number(limit),
        search: search ? String(search) : undefined,
        category: category ? String(category) : undefined,
        difficulty: difficulty ? String(difficulty) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy ? String(sortBy) : undefined,
        status: status ? String(status) : undefined,
      });

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/tasks/:idOrSlug', (req, res) => {
    try {
      const task = db.getTaskByIdOrSlug(req.params.idOrSlug);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      res.json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tasks/create', (req, res) => {
    try {
      const newTask = db.createTask(req.body);
      res.json({ success: true, data: newTask });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tasks/:id/take', (req, res) => {
    try {
      const { userId = 'USER-001' } = req.body;
      const result = db.takeJob(userId, req.params.id);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tasks/:id/save', (req, res) => {
    try {
      const { userId = 'USER-001' } = req.body;
      const savedIds = db.toggleSaveTask(userId, req.params.id);
      res.json({ success: true, savedTaskIds: savedIds });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Assignments & Submissions
  app.get('/api/assignments', (req, res) => {
    try {
      const { userId, status } = req.query;
      const list = db.getAssignments(userId ? String(userId) : undefined, status ? String(status) : undefined);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/assignments/:id/submit', (req, res) => {
    try {
      const { textSubmission, fileName, fileSize } = req.body;
      const result = db.submitAssignment(req.params.id, textSubmission, fileName, fileSize);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/assignments/:id/review', (req, res) => {
    try {
      const { action, notes, rating } = req.body;
      const result = db.reviewAssignment(req.params.id, action, notes, rating);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Ledger, Wallet & Withdrawals
  app.get('/api/wallet/transactions', (req, res) => {
    try {
      const { userId = 'USER-001' } = req.query;
      const list = db.getTransactions(String(userId));
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/wallet/withdrawals', (req, res) => {
    try {
      const { userId } = req.query;
      const list = db.getWithdrawals(userId ? String(userId) : undefined);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/wallet/withdraw', (req, res) => {
    try {
      const { userId = 'USER-001', amount, paymentMethod, destinationDetails, accountHolderName } = req.body;
      const result = db.requestWithdrawal(userId, Number(amount), paymentMethod, destinationDetails, accountHolderName);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Monthly Challenge
  app.get('/api/challenge', (req, res) => {
    try {
      const challenge = db.getChallenge();
      res.json({ success: true, data: challenge });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/challenge/leaderboard', (req, res) => {
    try {
      const leaderboard = db.getChallengeLeaderboard();
      res.json({ success: true, data: leaderboard });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/challenge/join', (req, res) => {
    try {
      const { userId = 'USER-001' } = req.body;
      const result = db.joinChallenge(userId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Testimonials, FAQ & Support
  app.get('/api/testimonials', (req, res) => {
    try {
      const list = db.getTestimonials();
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/faqs', (req, res) => {
    try {
      const list = db.getFAQs();
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/faqs/:id/vote', (req, res) => {
    try {
      const { helpful } = req.body;
      const item = db.voteFAQ(req.params.id, Boolean(helpful));
      res.json({ success: true, data: item });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/tickets', (req, res) => {
    try {
      const { userId } = req.query;
      const list = db.getTickets(userId ? String(userId) : undefined);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tickets', (req, res) => {
    try {
      const { userId = 'USER-001', category, subject, description } = req.body;
      const ticket = db.createTicket(userId, category, subject, description);
      res.json({ success: true, data: ticket });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tickets/:id/reply', (req, res) => {
    try {
      const { senderId, senderName, role, message } = req.body;
      const ticket = db.replyTicket(req.params.id, senderId, senderName, role, message);
      res.json({ success: true, data: ticket });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Sponsors
  app.get('/api/sponsors', (req, res) => {
    try {
      const list = db.getSponsors();
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/sponsors', (req, res) => {
    try {
      const sponsor = db.updateSponsor(req.body);
      res.json({ success: true, data: sponsor });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Auth & Profile
  app.get('/api/auth/me', (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.json({ success: true, data: null });
      }
      const user = db.getUserById(String(userId));
      res.json({ success: true, data: user || null });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, captchaVerified } = req.body;
      if (!captchaVerified) {
        return res.status(400).json({ success: false, message: 'Server-side CAPTCHA verification failed.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
      }
      let user = db.getUserByEmail(email.trim());
      if (!user) {
        // Register genuine freelancer account for this email
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
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, phone, address, avatarType, role, companyName, companyWebsite, industry, captchaVerified } = req.body;
      if (!captchaVerified) {
        return res.status(400).json({ success: false, message: 'Server-side CAPTCHA verification failed.' });
      }
      const user = db.registerUser(name, email, phone, address, avatarType, role, companyName, companyWebsite, industry);
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Notifications API
  app.get('/api/notifications', (req, res) => {
    try {
      const { userId } = req.query;
      const list = db.getNotifications(userId ? String(userId) : undefined);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    try {
      const success = db.markNotificationRead(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/notifications/read-all', (req, res) => {
    try {
      const { userId } = req.body;
      const success = db.markAllNotificationsRead(String(userId));
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/notifications/test-approval', (req, res) => {
    try {
      const { userId, title, message, amount } = req.body;
      const notif = db.addNotification(
        userId,
        'TASK_APPROVED',
        title || 'Tugas Disetujui & Saldo Ditambahkan',
        message || 'Pekerjaan Anda telah diverifikasi oleh tim kurator WEJOBS. Saldo sebesar $25.00 USD telah dikreditkan ke dompet Anda.',
        amount || 25.0
      );
      res.json({ success: true, data: notif });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/admin-login', (req, res) => {
    try {
      const { adminKey, code } = req.body;
      if (adminKey === 'wejobs-admin-2026' || adminKey === 'admin' || code === '8899') {
        const admin = db.getUserById('USER-ADMIN');
        return res.json({ success: true, data: admin });
      }
      res.status(401).json({ success: false, message: 'Invalid administrative security credentials.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/users/profile', (req, res) => {
    try {
      const { userId = 'USER-001', ...profileData } = req.body;
      const updated = db.updateUser(userId, profileData);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin Hub
  app.get('/api/admin/overview', (req, res) => {
    try {
      const stats = db.getPlatformStats();
      const allUsers = db.getAllUsers();
      const withdrawals = db.getWithdrawals();
      const auditLogs = db.getAuditLogs();

      res.json({
        success: true,
        data: {
          stats,
          totalUsers: allUsers.length,
          pendingWithdrawalsCount: withdrawals.filter((w) => w.status === 'PENDING').length,
          recentAuditLogs: auditLogs,
          users: allUsers,
          withdrawals,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/withdrawals/:id/process', (req, res) => {
    try {
      const { action, reason } = req.body;
      const result = db.processWithdrawal(req.params.id, action, reason);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    try {
      const logs = db.getAuditLogs();
      res.json({ success: true, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite Middleware (Development vs Production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WEJOBS Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
