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
  AuditLog,
  PlatformStats,
  NotificationItem,
} from '../src/types';
import { generate4421Tasks } from './seedTasks';

// In-Memory Master Database instance
class Database {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private assignments: Map<string, TaskAssignment> = new Map();
  private transactions: Map<string, LedgerTransaction> = new Map();
  private withdrawals: Map<string, WithdrawalRequest> = new Map();
  private notifications: Map<string, NotificationItem> = new Map();
  private challenge: MonthlyChallenge;
  private challengeParticipants: Map<string, ChallengeParticipant> = new Map();
  private testimonials: TestimonialReview[] = [];
  private faqs: FAQItem[] = [];
  private tickets: Map<string, SupportTicket> = new Map();
  private sponsors: SponsorPartner[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    // 1. Seed 4,421 Tasks
    const allTasks = generate4421Tasks();
    for (const task of allTasks) {
      this.tasks.set(task.id, task);
    }
    console.log(`[WEJOBS DB] Loaded exactly ${this.tasks.size} unique tasks.`);

    // 2. Seed Super Admin (Platform Administration)
    const defaultAdmin: User = {
      id: 'USER-ADMIN',
      name: 'WEJOBS Super Admin',
      email: 'admin@wejobs.io',
      phone: '+1 (555) 000-0001',
      address: 'WEJOBS Global Operations HQ',
      bio: 'Global platform administrator and security compliance officer.',
      avatar: 'bear',
      avatarType: 'bear',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      paymentVerified: true,
      balanceAvailable: 0,
      balancePending: 0,
      balanceWithdrawn: 0,
      balanceEarned: 0,
      rating: 5.0,
      tasksCompleted: 0,
      tasksActive: 0,
      successRate: 100,
      onTimeRate: 100,
      acceptanceRate: 100,
      revisionRate: 0,
      fraudRiskScore: 0,
      fraudStatus: 'NORMAL',
      skills: ['Platform Governance', 'Audit', 'Financial Compliance'],
      portfolio: [],
      savedTaskIds: [],
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    this.users.set(defaultAdmin.id, defaultAdmin);

    // 3. Seed Sample Community Submissions for Admin Queue Audit
    const sampleAssignment3: TaskAssignment = {
      id: 'ASGN-1003',
      taskId: 'TASK-00007',
      taskTitle: 'Technical Deep Dive: Kubernetes Microservices Migration (#7)',
      taskCategory: 'Software & Technical Documentation',
      taskPaymentUSD: 45.0,
      taskDeadline: '2026-08-24',
      userId: 'USER-P1',
      userDisplayName: 'David Sterling',
      userEmail: 'david.sterling@cloudtech.io',
      userAvatar: 'penguin',
      status: 'SUBMITTED',
      textSubmission: 'Completed the 2,200-word step-by-step architectural guide on container orchestration, ingress controllers, and zero-downtime rolling updates.',
      fileName: 'kubernetes-migration-guide.pdf',
      fileSize: '1.8 MB',
      assignedAt: '2026-08-15T08:00:00.000Z',
      submittedAt: '2026-08-18T11:20:00.000Z',
      deadlineAt: '2026-08-24T23:59:59.000Z',
      version: 1,
    };

    const sampleAssignment4: TaskAssignment = {
      id: 'ASGN-1004',
      taskId: 'TASK-00010',
      taskTitle: 'English to Indonesian Financial Tech Translation (#10)',
      taskCategory: 'Translation & Localization',
      taskPaymentUSD: 28.0,
      taskDeadline: '2026-08-23',
      userId: 'USER-P2',
      userDisplayName: 'Chloe Bennett',
      userEmail: 'chloe.bennett@transglobal.org',
      userAvatar: 'rabbit',
      status: 'SUBMITTED',
      textSubmission: 'Terjemahan lengkap 1,800 kata materi edukasi fintech & crypto security. Istilah teknis disesuaikan dengan konteks perbankan OJK & BI.',
      fileName: 'terjemahan-fintech-edukasi.docx',
      fileSize: '520 KB',
      assignedAt: '2026-08-15T14:00:00.000Z',
      submittedAt: '2026-08-18T16:45:00.000Z',
      deadlineAt: '2026-08-23T23:59:59.000Z',
      version: 1,
    };

    const sampleAssignment5: TaskAssignment = {
      id: 'ASGN-1005',
      taskId: 'TASK-00015',
      taskTitle: 'B2B SaaS Email Newsletter: AI Productivity Tools (#15)',
      taskCategory: 'Copywriting & Marketing',
      taskPaymentUSD: 18.0,
      taskDeadline: '2026-08-21',
      userId: 'USER-P3',
      userDisplayName: 'Budi Santoso',
      userEmail: 'budi.santoso@digitalwriter.id',
      userAvatar: 'bear',
      status: 'SUBMITTED',
      textSubmission: 'Subject lines (3 variants A/B testing), preview text, and high-converting CTA sequence for the Q3 AI workflow product launch campaign.',
      fileName: 'b2b-saas-email-campaign.md',
      fileSize: '120 KB',
      assignedAt: '2026-08-16T11:00:00.000Z',
      submittedAt: '2026-08-19T09:15:00.000Z',
      deadlineAt: '2026-08-21T23:59:59.000Z',
      version: 1,
    };

    this.assignments.set(sampleAssignment3.id, sampleAssignment3);
    this.assignments.set(sampleAssignment4.id, sampleAssignment4);
    this.assignments.set(sampleAssignment5.id, sampleAssignment5);

    // 4. Seed Withdrawals (Pending Admin Confirmation & Processed)
    const seedWd2: WithdrawalRequest = {
      id: 'WD-1002',
      userId: 'USER-P3',
      userName: 'Budi Santoso',
      userEmail: 'budi.santoso@digitalwriter.id',
      amount: 250.0,
      currency: 'USD',
      paymentMethod: 'Bank Lokal',
      destinationDetails: 'Bank Central Asia (BCA) - No. Rek: 8820192819',
      accountHolderName: 'Budi Santoso',
      status: 'PENDING',
      createdAt: '2026-08-19T14:20:00.000Z',
    };

    const seedWd3: WithdrawalRequest = {
      id: 'WD-1003',
      userId: 'USER-P2',
      userName: 'Chloe Bennett',
      userEmail: 'chloe.bennett@transglobal.org',
      amount: 180.0,
      currency: 'USD',
      paymentMethod: 'USDT',
      destinationDetails: 'TRC-20 Address: TX9vK2Lm88pQz1nBRt77wYe2M',
      accountHolderName: 'Chloe Bennett',
      status: 'PENDING',
      createdAt: '2026-08-18T18:00:00.000Z',
    };

    const seedWd4: WithdrawalRequest = {
      id: 'WD-1004',
      userId: 'USER-P1',
      userName: 'David Sterling',
      userEmail: 'david.sterling@cloudtech.io',
      amount: 320.0,
      currency: 'USD',
      paymentMethod: 'Wise',
      destinationDetails: 'david.sterling@wisetransfer.co.uk (GBP Account)',
      accountHolderName: 'David Sterling',
      status: 'PAID',
      createdAt: '2026-08-15T09:00:00.000Z',
      processedAt: '2026-08-16T12:00:00.000Z',
    };

    this.withdrawals.set(seedWd2.id, seedWd2);
    this.withdrawals.set(seedWd3.id, seedWd3);
    this.withdrawals.set(seedWd4.id, seedWd4);

    // 5. Seed Ledger Transactions
    this.transactions.set('TX-001', {
      id: 'TX-001',
      userId: 'USER-P1',
      type: 'TASK_REWARD',
      amount: 32.0,
      currency: 'USD',
      status: 'COMPLETED',
      referenceId: 'ASGN-0992',
      description: 'Reward for accepted task: Technical Whitepaper Summary',
      createdAt: '2026-08-15T12:00:00.000Z',
    });

    this.transactions.set('TX-002', {
      id: 'TX-002',
      userId: 'USER-P1',
      type: 'BONUS',
      amount: 5.0,
      currency: 'USD',
      status: 'COMPLETED',
      description: '5★ Quality Rating Bonus (Clean First-Pass Submission)',
      createdAt: '2026-08-15T12:05:00.000Z',
    });

    this.transactions.set('TX-003', {
      id: 'TX-003',
      userId: 'USER-P2',
      type: 'WITHDRAWAL',
      amount: -120.0,
      currency: 'USD',
      status: 'COMPLETED',
      referenceId: 'WD-0881',
      description: 'Withdrawal to PayPal',
      createdAt: '2026-08-01T16:00:00.000Z',
    });

    // 5. Seed Monthly Challenge
    this.challenge = {
      id: 'CHALLENGE-2026-08',
      name: 'WEJOBS MONTHLY CHALLENGE',
      slug: 'august-2026-challenge',
      tagline: 'Work. Compete. Earn More.',
      description: 'The premier monthly freelancer sprint. Take assignments, maintain pristine 5★ quality, meet deadlines, and win your share of the $1,700 USD reward pool.',
      period: 'August 2026',
      maxParticipants: 500,
      registeredCount: 328,
      remainingSlots: 172,
      registrationStartAt: '2026-08-01T00:00:00.000Z',
      registrationEndAt: '2026-08-20T23:59:59.000Z',
      challengeStartAt: '2026-08-01T00:00:00.000Z',
      challengeEndAt: '2026-08-31T23:59:59.000Z',
      prizePool: 1700,
      firstPrize: 1000,
      status: 'ACTIVE',
      rules: [
        'One Account: Each participant may use only one registered, verified WEJOBS account.',
        'Genuine Work: All tasks must be genuinely produced per client specifications without plagiarism.',
        'No Manipulation: Faking submissions, colluding on reviews, or manipulating task completion is strictly prohibited.',
        'Quality First: Scoring considers task difficulty, 5★ ratings (+5 pts), zero-revision approvals (+5 pts), and on-time submissions (+3 pts).',
        'Strict Verification: All leaderboard rankings remain provisional until post-competition audit is finalized.',
      ],
      rewards: [
        { category: '1st Place Champion', rankTitle: 'Freelancer of the Month', amount: 1000 },
        { category: '2nd Place', rankTitle: 'Runner-Up Elite', amount: 300 },
        { category: '3rd Place', rankTitle: 'Third Place Laureate', amount: 150 },
        { category: 'Specialty Award', rankTitle: 'Best Writer of the Month', amount: 100 },
        { category: 'Rising Star', rankTitle: 'Top New Talent (<90 Days)', amount: 75 },
        { category: 'Consistency Award', rankTitle: 'Zero-Revision Streak Master', amount: 75 },
      ],
      previousChampions: [
        { monthYear: 'July 2026', winnerName: 'Elena Rostova', avatar: 'fox', country: 'Canada', points: 645, category: '1st Place ($1,000)', prize: '$1,000 USD' },
        { monthYear: 'June 2026', winnerName: 'Marcus Vance', avatar: 'panda', country: 'United Kingdom', points: 590, category: '1st Place ($1,000)', prize: '$1,000 USD' },
        { monthYear: 'May 2026', winnerName: 'Siti Rahmawati', avatar: 'cat', country: 'Indonesia', points: 610, category: '1st Place ($1,000)', prize: '$1,000 USD' },
      ],
    };

    // Seed Challenge Participants Leaderboard
    const seedParticipants: ChallengeParticipant[] = [
      { id: 'CP-01', challengeId: this.challenge.id, userId: 'USER-P1', displayName: 'David Sterling', avatar: 'penguin', joinedAt: '2026-08-01', score: 385, rank: 1, completedQualifyingTasks: 24, rating: 4.98, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-02', challengeId: this.challenge.id, userId: 'USER-P2', displayName: 'Chloe Bennett', avatar: 'rabbit', joinedAt: '2026-08-01', score: 360, rank: 2, completedQualifyingTasks: 21, rating: 4.95, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-03', challengeId: this.challenge.id, userId: 'USER-P3', displayName: 'Budi Santoso', avatar: 'bear', joinedAt: '2026-08-02', score: 330, rank: 3, completedQualifyingTasks: 19, rating: 4.92, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-04', challengeId: this.challenge.id, userId: 'USER-P4', displayName: 'Sarah Jenkins', avatar: 'cat', joinedAt: '2026-08-02', score: 295, rank: 4, completedQualifyingTasks: 16, rating: 4.95, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-05', challengeId: this.challenge.id, userId: 'USER-P5', displayName: 'Aisha Tanaka', avatar: 'cat', joinedAt: '2026-08-03', score: 275, rank: 5, completedQualifyingTasks: 15, rating: 5.0, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-06', challengeId: this.challenge.id, userId: 'USER-P6', displayName: 'Liam O Connor', avatar: 'hamster', joinedAt: '2026-08-03', score: 250, rank: 6, completedQualifyingTasks: 14, rating: 4.88, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-07', challengeId: this.challenge.id, userId: 'USER-P7', displayName: 'Nadia Kowalski', avatar: 'fox', joinedAt: '2026-08-04', score: 230, rank: 7, completedQualifyingTasks: 12, rating: 4.91, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
      { id: 'CP-08', challengeId: this.challenge.id, userId: 'USER-P8', displayName: 'Mateo Hernandez', avatar: 'panda', joinedAt: '2026-08-04', score: 215, rank: 8, completedQualifyingTasks: 11, rating: 4.85, verificationStatus: 'PROVISIONAL', fraudStatus: 'CLEAR' },
    ];

    for (const p of seedParticipants) {
      this.challengeParticipants.set(p.userId, p);
    }

    // 6. Seed Exactly 10 Sample Testimonial Reviews
    this.testimonials = [
      { id: 'REV-01', reviewerName: 'Charles', rating: 4.9, country: 'United States', workCategory: 'Technical Writing', review: 'Clear assignment briefs, prompt client approvals, and dependable payments in USD. Outstanding platform for remote writers.', avatar: 'bear' },
      { id: 'REV-02', reviewerName: 'Sarah', rating: 5.0, country: 'United Kingdom', workCategory: 'SEO & Web Content', review: 'I love how organized the categories are. Once you deliver high-quality work, review feedback and reward approvals are very fast.', avatar: 'rabbit' },
      { id: 'REV-03', reviewerName: 'Evelyn', rating: 4.8, country: 'Canada', workCategory: 'Translation & Localization', review: 'Consistent flow of translation tasks with fair compensation. The atomic slot system guarantees your job is secure once claimed.', avatar: 'fox' },
      { id: 'REV-04', reviewerName: 'Daniel', rating: 4.9, country: 'Australia', workCategory: 'Editing & Proofreading', review: 'The editorial guidelines make expectations crystal clear. Reaching the $100 minimum threshold and cashing out was seamless.', avatar: 'penguin' },
      { id: 'REV-05', reviewerName: 'Emily', rating: 5.0, country: 'Germany', workCategory: 'Copywriting & Marketing', review: 'The Monthly Challenge pushes your consistency to another level. Competing on quality and ratings is genuinely rewarding.', avatar: 'cat' },
      { id: 'REV-06', reviewerName: 'Michael', rating: 4.8, country: 'Netherlands', workCategory: 'Research Summaries', review: 'Direct, focused microtasks without bloated bidding wars. You choose the job, submit the work, and get credited on approval.', avatar: 'panda' },
      { id: 'REV-07', reviewerName: 'Olivia', rating: 4.9, country: 'Sweden', workCategory: 'Creative Writing', review: 'High variety of fiction, storytelling, and worldbuilding assignments. Great community standards and helpful support.', avatar: 'hamster' },
      { id: 'REV-08', reviewerName: 'James', rating: 4.7, country: 'Singapore', workCategory: 'Data Annotation', review: 'Well-structured dataset classification tasks with precise acceptance criteria. Everything is verified transparently.', avatar: 'bear' },
      { id: 'REV-09', reviewerName: 'Sophia', rating: 5.0, country: 'New Zealand', workCategory: 'Content Moderation', review: 'Smooth, reliable interface on mobile and desktop. The ledger tracking gives you full visibility into every reward and withdrawal.', avatar: 'fox' },
      { id: 'REV-10', reviewerName: 'William', rating: 4.9, country: 'Ireland', workCategory: 'Script & Storytelling', review: 'Clean black and orange aesthetic with zero clutter. A serious micro-task platform for serious digital creators.', avatar: 'penguin' },
    ];

    // 7. Seed Categorized FAQs
    this.faqs = [
      { id: 'FAQ-01', category: 'Account', question: 'How do I create and verify my WEJOBS account?', answer: 'Click "Start Earning" or "Register" at the top right, fill in your name, email, phone, and complete the server-side CAPTCHA verification. Once registered, verify your email to unlock all job slots and challenge access.', helpfulVotes: 142, unhelpfulVotes: 2, isFeatured: true },
      { id: 'FAQ-02', category: 'Account', question: 'Can I have multiple accounts?', answer: 'No. WEJOBS enforces a strict One-Account policy. Duplicate or shared accounts are flagged by our anti-fraud ledger and may result in restriction.', helpfulVotes: 89, unhelpfulVotes: 1 },
      { id: 'FAQ-03', category: 'Account', question: 'How do I change my profile avatar?', answer: 'Go to Profile > Edit Profile. You can choose from one of the 7 built-in avatars (Cat, Panda, Bear, Rabbit, Fox, Penguin, Hamster) or upload your own JPG/PNG/WebP photo.', helpfulVotes: 64, unhelpfulVotes: 0 },
      { id: 'FAQ-04', category: 'Jobs', question: 'How many total tasks/jobs are available on WEJOBS?', answer: 'The WEJOBS catalog contains exactly 4,421 unique task specifications across 13 diverse categories, updated with real-time slot availability.', helpfulVotes: 210, unhelpfulVotes: 3, isFeatured: true },
      { id: 'FAQ-05', category: 'Jobs', question: 'What happens when I click "Take Job"?', answer: 'When you click "Take Job", the system atomically reserves one slot for you. The task moves into your "My Jobs > In Progress" tab with a live deadline countdown.', helpfulVotes: 178, unhelpfulVotes: 4, isFeatured: true },
      { id: 'FAQ-06', category: 'Jobs', question: 'Can two users claim the last available slot simultaneously?', answer: 'No. Our backend uses atomic transaction locking. If two users click simultaneously on the last slot, the first verified request claims it and the second receives a clear "Slots Full" notification.', helpfulVotes: 95, unhelpfulVotes: 0 },
      { id: 'FAQ-07', category: 'Jobs', question: 'What happens if I miss the task deadline?', answer: 'Tasks submitted past deadline may be cancelled or receive a small score penalty in the Monthly Challenge. Always check the estimated time before claiming a task.', helpfulVotes: 73, unhelpfulVotes: 2 },
      { id: 'FAQ-08', category: 'Submission', question: 'What formats can I submit for writing and editing jobs?', answer: 'You can submit direct formatted text in our editor or upload standard document formats including .docx, .pdf, .txt, and .md files up to 15MB.', helpfulVotes: 112, unhelpfulVotes: 1 },
      { id: 'FAQ-09', category: 'Submission', question: 'What is the revision process?', answer: 'Clients or reviewers may request minor revisions within 24 hours if certain guidelines need adjustment. You will receive a notification with specific reviewer notes.', helpfulVotes: 88, unhelpfulVotes: 2 },
      { id: 'FAQ-10', category: 'Submission', question: 'How does WEJOBS verify originality and prevent plagiarism?', answer: 'All text submissions are evaluated against our automated originality engine. Content with unauthorized copied text will be rejected with zero tolerance.', helpfulVotes: 140, unhelpfulVotes: 1 },
      { id: 'FAQ-11', category: 'Payment', question: 'In what currency are rewards calculated and paid?', answer: 'All task rewards, bonuses, and Monthly Challenge prizes are calculated and paid in US Dollars (USD).', helpfulVotes: 310, unhelpfulVotes: 5, isFeatured: true },
      { id: 'FAQ-12', category: 'Payment', question: 'What is the total payout record of WEJOBS?', answer: 'WEJOBS has proudly distributed over $1,728,000.00+ in verified USD rewards to independent freelancers worldwide.', helpfulVotes: 420, unhelpfulVotes: 2, isFeatured: true },
      { id: 'FAQ-13', category: 'Withdrawal', question: 'What is the minimum withdrawal amount?', answer: 'The final minimum withdrawal threshold is exactly $100.00 USD. Any withdrawal request below $100.00 is strictly blocked by financial validation.', helpfulVotes: 540, unhelpfulVotes: 4, isFeatured: true },
      { id: 'FAQ-14', category: 'Withdrawal', question: 'What payment channels are supported for cashing out?', answer: 'We support local bank transfers (Bank Lokal), PayPal, Wise, and USDT (TRC-20/ERC-20). You must verify your recipient destination details in your Wallet settings before your first withdrawal.', helpfulVotes: 290, unhelpfulVotes: 3 },
      { id: 'FAQ-15', category: 'Withdrawal', question: 'How long does withdrawal processing take?', answer: 'Standard withdrawal requests are reviewed and processed within 24 to 48 business hours after security verification.', helpfulVotes: 165, unhelpfulVotes: 3 },
      { id: 'FAQ-16', category: 'Monthly Challenge', question: 'What is the prize structure for the WEJOBS Monthly Challenge?', answer: '1st Place Champion receives $1,000 USD. 2nd Place: $300 USD. 3rd Place: $150 USD. Best Writer: $100 USD. Rising Star: $75 USD. Consistency Award: $75 USD. Total prize pool is $1,700 USD.', helpfulVotes: 480, unhelpfulVotes: 2, isFeatured: true },
      { id: 'FAQ-17', category: 'Monthly Challenge', question: 'How many participants can join the Monthly Challenge?', answer: 'Each monthly competition has a strict capacity of 500 participant slots. Once 500 freelancers register, registration is locked.', helpfulVotes: 230, unhelpfulVotes: 1 },
      { id: 'FAQ-18', category: 'Monthly Challenge', question: 'How are challenge points earned?', answer: 'Points are awarded based on task difficulty (Micro: +5, Small: +10, Med: +20, Med-High: +30, Large: +50), plus bonuses for 5★ ratings (+5), clean first-pass approvals (+5), and on-time completion (+3).', helpfulVotes: 195, unhelpfulVotes: 0 },
      { id: 'FAQ-19', category: 'Monthly Challenge', question: 'When are challenge winners finalized?', answer: 'Leaderboard rankings during the month are Provisional. At the conclusion of the challenge period, all submissions undergo a fairness and anti-fraud audit before rewards are officially distributed.', helpfulVotes: 140, unhelpfulVotes: 1 },
      { id: 'FAQ-20', category: 'Security', question: 'How does WEJOBS protect user data and financial ledger balances?', answer: 'All sensitive actions utilize encrypted server-side state transitions, immutable transaction ledgers, rate limiting, and strict RBAC authorization.', helpfulVotes: 105, unhelpfulVotes: 0 },
    ];

    // 8. Seed Official Sponsor Partner
    this.sponsors = [
      {
        id: 'SPONSOR-01',
        name: 'WEJOBS Official Partner Network',
        logoUrl: 'https://assets.rocket.new/rocket/c-logo-new.webp',
        websiteUrl: 'https://wejobs.io/partners',
        description: 'Verified global freelance network and strategic infrastructure partner.',
        isActive: true,
        displayOrder: 1,
        speedSeconds: 30,
        direction: 'rtl',
        pauseOnHover: true,
      },
    ];

    // 9. Initial Audit Log
    this.auditLogs.push({
      id: 'AUDIT-001',
      actor: 'SYSTEM_BOOTSTRAP',
      actorRole: 'SYSTEM',
      action: 'DATABASE_INITIALIZATION',
      targetType: 'PLATFORM',
      targetId: 'WEJOBS_CORE',
      metadata: { totalTasks: 4421, prizePool: 1700, minWithdrawal: 100 },
      timestamp: new Date().toISOString(),
    });
  }

  // --- Task Query Methods ---
  public getTasks(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    status?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    let list = Array.from(this.tasks.values());

    // Search filter
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subtype.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.targetAudience.toLowerCase().includes(q) ||
          t.clientDisplayName.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.category && params.category !== 'All') {
      list = list.filter((t) => t.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Difficulty filter
    if (params.difficulty && params.difficulty !== 'All') {
      list = list.filter((t) => t.difficulty === params.difficulty);
    }

    // Price range
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      list = list.filter((t) => t.paymentUSD >= params.minPrice!);
    }
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      list = list.filter((t) => t.paymentUSD <= params.maxPrice!);
    }

    // Status filter
    if (params.status && params.status !== 'All') {
      list = list.filter((t) => t.status === params.status);
    }

    // Sorting
    const sort = params.sortBy || 'newest';
    if (sort === 'highest-reward') {
      list.sort((a, b) => b.paymentUSD - a.paymentUSD);
    } else if (sort === 'lowest-reward') {
      list.sort((a, b) => a.paymentUSD - b.paymentUSD);
    } else if (sort === 'slots-available') {
      list.sort((a, b) => b.remainingSlots - a.remainingSlots);
    } else if (sort === 'deadline-soon') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      // Default: newest / id order
      list.sort((a, b) => parseInt(a.id.replace('TASK-', '')) - parseInt(b.id.replace('TASK-', '')));
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = list.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public getTaskByIdOrSlug(idOrSlug: string): Task | undefined {
    // Check by ID first
    if (this.tasks.has(idOrSlug)) {
      return this.tasks.get(idOrSlug);
    }
    // Search by slug
    return Array.from(this.tasks.values()).find((t) => t.slug === idOrSlug || t.id === idOrSlug);
  }

  public createTask(data: Partial<Task>): Task {
    const nextIdNum = this.tasks.size + 1;
    const id = `TASK-${String(nextIdNum).padStart(5, '0')}`;
    const slug = data.slug || `${(data.title || 'new-job').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nextIdNum}`;
    const capacity = data.capacity || 30;

    const newTask: Task = {
      id,
      slug,
      title: data.title || 'Untitled Task',
      category: data.category || 'Article & Blog Writing',
      subtype: data.subtype || 'Article Writing',
      difficulty: data.difficulty || 'Intermediate',
      taskObjective: data.taskObjective || 'Complete client assignment according to specifications.',
      targetAudience: data.targetAudience || 'General Audience',
      clientDisplayName: data.clientDisplayName || 'Verified Partner Studio',
      clientRating: 4.9,
      clientVerified: true,
      language: data.language || 'English (US)',
      description: data.description || 'Detailed assignment guidelines.',
      detailedInstructions: data.detailedInstructions || ['Follow standard editorial quality rules.'],
      expectedDeliverable: data.expectedDeliverable || 'Written document in .docx or text format.',
      wordCountOrUnit: data.wordCountOrUnit || '700-900 words',
      requiredFormat: data.requiredFormat || 'Markdown / Document (.docx)',
      allowedFileTypes: data.allowedFileTypes || ['docx', 'pdf', 'txt', 'md'],
      requirements: data.requirements || ['100% human-created original work.'],
      forbiddenItems: data.forbiddenItems || ['No copied or plagiarized text.'],
      originalityRequirement: '100% Original Content',
      plagiarismRule: 'Strict zero-tolerance plagiarism threshold.',
      acceptanceCriteria: data.acceptanceCriteria || ['Complete all sections accurately.'],
      revisionPolicy: 'Up to 2 standard revision rounds allowed within 24 hours.',
      estimatedCompletionTime: data.estimatedCompletionTime || '1 hour',
      paymentUSD: Number(data.paymentUSD) || 15.0,
      paymentBasis: 'Per accepted submission deliverable',
      deadline: data.deadline || '2026-09-01',
      capacity,
      currentSubmissions: 0,
      remainingSlots: capacity,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    this.tasks.set(newTask.id, newTask);
    this.addAuditLog('CLIENT_OR_ADMIN', 'TASK_CREATED', 'TASK', newTask.id, { title: newTask.title });
    return newTask;
  }

  // --- Task Claiming & Assignment State Management (Atomic) ---
  public takeJob(userId: string, taskId: string): { success: boolean; message: string; assignment?: TaskAssignment } {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { success: false, message: 'Task not found.' };
    }
    if (task.status !== 'ACTIVE' || task.remainingSlots <= 0) {
      return { success: false, message: 'Sorry, this task has reached full capacity or is no longer active.' };
    }

    const user = this.users.get(userId);
    if (!user) {
      return { success: false, message: 'User not authenticated.' };
    }

    // Check if user already took this exact task
    const existing = Array.from(this.assignments.values()).find(
      (a) => a.taskId === taskId && a.userId === userId && ['IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW'].includes(a.status)
    );
    if (existing) {
      return { success: false, message: 'You already have an active assignment for this task.' };
    }

    // Atomic Slot Decrement
    task.currentSubmissions += 1;
    task.remainingSlots = task.capacity - task.currentSubmissions;
    if (task.remainingSlots <= 0) {
      task.status = 'FULL';
    }

    // Create Assignment
    const asgnId = `ASGN-${Date.now().toString().slice(-6)}`;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 3);

    const assignment: TaskAssignment = {
      id: asgnId,
      taskId: task.id,
      taskTitle: task.title,
      taskCategory: task.category,
      taskPaymentUSD: task.paymentUSD,
      taskDeadline: task.deadline,
      userId: user.id,
      userDisplayName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      status: 'IN_PROGRESS',
      assignedAt: new Date().toISOString(),
      deadlineAt: deadlineDate.toISOString(),
      version: 1,
    };

    this.assignments.set(assignment.id, assignment);
    user.tasksActive += 1;
    this.addAuditLog(user.name, 'TAKE_JOB_ATOMIC', 'ASSIGNMENT', assignment.id, { taskId, remainingSlots: task.remainingSlots });

    return { success: true, message: 'Task claimed successfully! Deliverable is now in progress.', assignment };
  }

  public getAssignments(userId?: string, status?: string): TaskAssignment[] {
    let list = Array.from(this.assignments.values());
    if (userId) {
      list = list.filter((a) => a.userId === userId);
    }
    if (status && status !== 'ALL') {
      list = list.filter((a) => a.status === status);
    }
    return list.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
  }

  public submitAssignment(assignmentId: string, textSubmission: string, fileName?: string, fileSize?: string) {
    const asgn = this.assignments.get(assignmentId);
    if (!asgn) return { success: false, message: 'Assignment not found.' };

    asgn.status = 'SUBMITTED';
    asgn.textSubmission = textSubmission;
    if (fileName) {
      asgn.fileName = fileName;
      asgn.fileSize = fileSize || '1.2 MB';
      asgn.fileUrl = `/uploads/${fileName}`;
    }
    asgn.submittedAt = new Date().toISOString();
    asgn.version += 1;

    this.addAuditLog(asgn.userDisplayName, 'SUBMIT_ASSIGNMENT', 'ASSIGNMENT', asgn.id, { version: asgn.version });
    return { success: true, message: 'Submission uploaded and routed to client review queue.', assignment: asgn };
  }

  public reviewAssignment(assignmentId: string, action: 'ACCEPT' | 'REVISE' | 'REJECT', notes: string, rating: number = 5.0) {
    const asgn = this.assignments.get(assignmentId);
    if (!asgn) return { success: false, message: 'Assignment not found.' };

    const user = this.users.get(asgn.userId);

    if (action === 'ACCEPT') {
      asgn.status = 'ACCEPTED';
      asgn.reviewedAt = new Date().toISOString();
      asgn.clientFeedback = notes || 'Deliverable fulfills all acceptance criteria. Excellent work.';
      asgn.ratingGiven = rating;

      if (user) {
        user.tasksActive = Math.max(0, user.tasksActive - 1);
        user.tasksCompleted += 1;
        user.balanceAvailable += asgn.taskPaymentUSD;
        user.balanceEarned += asgn.taskPaymentUSD;

        // Ledger Transaction Record
        const txId = `TX-${Date.now().toString().slice(-6)}`;
        this.transactions.set(txId, {
          id: txId,
          userId: user.id,
          type: 'TASK_REWARD',
          amount: asgn.taskPaymentUSD,
          currency: 'USD',
          status: 'COMPLETED',
          referenceId: asgn.id,
          description: `Reward for accepted task: ${asgn.taskTitle}`,
          createdAt: new Date().toISOString(),
        });

        // Award Challenge Points if participant
        const cp = this.challengeParticipants.get(user.id);
        if (cp && cp.verificationStatus !== 'DISQUALIFIED') {
          let pointsGained = 20; // Base medium task
          if (rating >= 5.0) pointsGained += 5; // 5★ Bonus
          if (asgn.version === 1) pointsGained += 5; // First-pass zero revision bonus
          pointsGained += 3; // On time bonus
          cp.score += pointsGained;
          cp.completedQualifyingTasks += 1;
        }

        // TRIGGER USER NOTIFICATION (Approved by Admin)
        this.addNotification(
          user.id,
          'TASK_APPROVED',
          'Tugas Disetujui & Saldo Masuk!',
          `Pekerjaan Anda untuk "${asgn.taskTitle}" telah disetujui oleh Tim Kurator/Admin. Saldo sebesar $${asgn.taskPaymentUSD.toFixed(2)} USD telah ditambahkan ke dompet Anda.`,
          asgn.taskPaymentUSD,
          { taskId: asgn.taskId, assignmentId: asgn.id }
        );
      }
    } else if (action === 'REVISE') {
      asgn.status = 'REVISION_REQUESTED';
      asgn.revisionNotes = notes;
      asgn.reviewedAt = new Date().toISOString();

      if (user) {
        this.addNotification(
          user.id,
          'TASK_REVISION',
          'Permintaan Revisi dari Admin',
          `Tugas "${asgn.taskTitle}" memerlukan perbaikan sebelum disetujui. Catatan Admin: ${notes || 'Mohon periksa kembali kesesuaian format dan instruksi.'}`,
          undefined,
          { taskId: asgn.taskId, assignmentId: asgn.id }
        );
      }
    } else if (action === 'REJECT') {
      asgn.status = 'REJECTED';
      asgn.clientFeedback = notes || 'Submission did not satisfy the minimum required acceptance criteria.';
      asgn.reviewedAt = new Date().toISOString();
      if (user) {
        user.tasksActive = Math.max(0, user.tasksActive - 1);
        this.addNotification(
          user.id,
          'TASK_REJECTED',
          'Penyerahan Tugas Ditolak',
          `Hasil kerja untuk "${asgn.taskTitle}" ditolak: ${notes || 'Kualitas tidak memenuhi standar kriteria.'}`,
          undefined,
          { taskId: asgn.taskId, assignmentId: asgn.id }
        );
      }
    }

    this.addAuditLog('REVIEWER', `ASSIGNMENT_${action}`, 'ASSIGNMENT', asgn.id, { notes, rating });
    return { success: true, message: `Assignment status updated to ${asgn.status}.`, assignment: asgn };
  }

  // --- Financial & Ledger & Withdrawal Rules ---
  public getTransactions(userId: string): LedgerTransaction[] {
    return Array.from(this.transactions.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public requestWithdrawal(
    userId: string,
    amount: number,
    paymentMethod: 'Bank Lokal' | 'PayPal' | 'Wise' | 'USDT',
    destinationDetails: string,
    accountHolderName: string
  ) {
    const user = this.users.get(userId);
    if (!user) return { success: false, message: 'User not found.' };

    // STRICT RULE: Minimum withdrawal is $100.00 USD
    if (amount < 100.0) {
      return { success: false, message: 'Withdrawal rejected: The minimum withdrawal amount is $100.00 USD.' };
    }

    if (user.balanceAvailable < amount) {
      return { success: false, message: `Insufficient available balance. You have $${user.balanceAvailable.toFixed(2)} USD available.` };
    }

    // Deduct available balance
    user.balanceAvailable -= amount;
    user.balancePending += amount;

    const wdId = `WD-${Date.now().toString().slice(-6)}`;
    const withdrawal: WithdrawalRequest = {
      id: wdId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount,
      currency: 'USD',
      paymentMethod,
      destinationDetails,
      accountHolderName,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.withdrawals.set(withdrawal.id, withdrawal);

    // Ledger Transaction Entry
    const txId = `TX-${Date.now().toString().slice(-6)}`;
    this.transactions.set(txId, {
      id: txId,
      userId: user.id,
      type: 'WITHDRAWAL',
      amount: -amount,
      currency: 'USD',
      status: 'PENDING',
      referenceId: withdrawal.id,
      description: `Withdrawal request of $${amount.toFixed(2)} USD via ${paymentMethod}`,
      createdAt: new Date().toISOString(),
    });

    this.addAuditLog(user.name, 'WITHDRAWAL_REQUESTED', 'WITHDRAWAL', withdrawal.id, { amount, paymentMethod });
    return { success: true, message: 'Withdrawal request submitted successfully. Processing within 24-48 hours.', withdrawal };
  }

  public processWithdrawal(withdrawalId: string, action: 'APPROVE' | 'PAY' | 'REJECT', reason?: string) {
    const wd = this.withdrawals.get(withdrawalId);
    if (!wd) return { success: false, message: 'Withdrawal record not found.' };

    const user = this.users.get(wd.userId);

    if (action === 'APPROVE') {
      wd.status = 'APPROVED';
    } else if (action === 'PAY') {
      wd.status = 'PAID';
      wd.processedAt = new Date().toISOString();
      if (user) {
        user.balancePending = Math.max(0, user.balancePending - wd.amount);
        user.balanceWithdrawn += wd.amount;

        // TRIGGER NOTIFICATION: Withdrawal Approved and Paid
        this.addNotification(
          user.id,
          'WITHDRAWAL_PAID',
          'Penarikan Dana Berhasil Ditransfer!',
          `Permintaan penarikan dana sebesar $${wd.amount.toFixed(2)} USD melalui ${wd.paymentMethod} (${wd.destinationDetails}) telah disetujui & berhasil dikirim ke rekening Anda.`,
          wd.amount,
          { withdrawalId: wd.id }
        );
      }
    } else if (action === 'REJECT') {
      wd.status = 'REJECTED';
      wd.rejectionReason = reason || 'Destination details could not be verified.';
      if (user) {
        // Refund funds back to available balance
        user.balancePending = Math.max(0, user.balancePending - wd.amount);
        user.balanceAvailable += wd.amount;

        // TRIGGER NOTIFICATION: Withdrawal Rejected and Refunded
        this.addNotification(
          user.id,
          'WITHDRAWAL_REJECTED',
          'Penarikan Dana Ditolak (Saldo Dikembalikan)',
          `Permintaan penarikan sebesar $${wd.amount.toFixed(2)} USD ditolak oleh Admin (${reason || 'Data rekening tidak valid'}). Saldo telah dikembalikan ke dompet aktif Anda.`,
          wd.amount,
          { withdrawalId: wd.id }
        );
      }
    }

    this.addAuditLog('ADMIN', `WITHDRAWAL_${action}`, 'WITHDRAWAL', wd.id, { reason });
    return { success: true, message: `Withdrawal ${action.toLowerCase()}ed successfully.`, withdrawal: wd };
  }

  public getWithdrawals(userId?: string): WithdrawalRequest[] {
    let list = Array.from(this.withdrawals.values());
    if (userId) {
      list = list.filter((w) => w.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Monthly Challenge & Leaderboard ---
  public getChallenge(): MonthlyChallenge {
    return {
      ...this.challenge,
      registeredCount: this.challengeParticipants.size,
      remainingSlots: Math.max(0, this.challenge.maxParticipants - this.challengeParticipants.size),
    };
  }

  public getChallengeLeaderboard(): ChallengeParticipant[] {
    const list = Array.from(this.challengeParticipants.values());
    list.sort((a, b) => b.score - a.score);
    return list.map((p, index) => ({
      ...p,
      rank: index + 1,
    }));
  }

  public joinChallenge(userId: string): { success: boolean; message: string; participant?: ChallengeParticipant } {
    if (this.challengeParticipants.has(userId)) {
      return { success: false, message: "You are already registered for this month's challenge!" };
    }
    if (this.challengeParticipants.size >= this.challenge.maxParticipants) {
      return { success: false, message: 'Sorry, all challenge slots have just been filled (500/500).' };
    }

    const user = this.users.get(userId);
    if (!user) return { success: false, message: 'User not found.' };

    const participant: ChallengeParticipant = {
      id: `CP-${Date.now().toString().slice(-6)}`,
      challengeId: this.challenge.id,
      userId: user.id,
      displayName: user.name,
      avatar: user.avatar,
      joinedAt: new Date().toISOString(),
      score: 0,
      rank: this.challengeParticipants.size + 1,
      completedQualifyingTasks: 0,
      rating: user.rating,
      verificationStatus: 'PROVISIONAL',
      fraudStatus: 'CLEAR',
    };

    this.challengeParticipants.set(user.id, participant);
    this.challenge.registeredCount = this.challengeParticipants.size;
    this.challenge.remainingSlots = this.challenge.maxParticipants - this.challenge.registeredCount;

    this.addAuditLog(user.name, 'JOIN_MONTHLY_CHALLENGE', 'CHALLENGE', this.challenge.id, { participantId: participant.id });
    return { success: true, message: "YOU'RE IN! You have successfully registered for the WEJOBS Monthly Challenge.", participant };
  }

  // --- Testimonials & FAQs & Support Tickets ---
  public getTestimonials(): TestimonialReview[] {
    return this.testimonials;
  }

  public getFAQs(): FAQItem[] {
    return this.faqs;
  }

  public voteFAQ(faqId: string, helpful: boolean) {
    const item = this.faqs.find((f) => f.id === faqId);
    if (item) {
      if (helpful) item.helpfulVotes += 1;
      else item.unhelpfulVotes += 1;
    }
    return item;
  }

  public getTickets(userId?: string): SupportTicket[] {
    let list = Array.from(this.tickets.values());
    if (userId) {
      list = list.filter((t) => t.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createTicket(userId: string, category: string, subject: string, description: string) {
    const user = this.users.get(userId);
    const id = `TCK-${Date.now().toString().slice(-6)}`;
    const ticket: SupportTicket = {
      id,
      userId,
      userName: user ? user.name : 'Valued Freelancer',
      userEmail: user ? user.email : 'user@wejobs.io',
      category,
      subject,
      description,
      priority: 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          id: `MSG-01`,
          senderId: userId,
          senderName: user ? user.name : 'Valued Freelancer',
          senderRole: 'USER',
          message: description,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  public replyTicket(ticketId: string, senderId: string, senderName: string, role: 'USER' | 'SUPPORT', message: string) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;

    ticket.messages.push({
      id: `MSG-${Date.now().toString().slice(-4)}`,
      senderId,
      senderName,
      senderRole: role,
      message,
      createdAt: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    if (role === 'SUPPORT') ticket.status = 'WAITING_USER';
    return ticket;
  }

  // --- Sponsors ---
  public getSponsors(): SponsorPartner[] {
    return this.sponsors;
  }

  public updateSponsor(data: Partial<SponsorPartner>) {
    if (this.sponsors.length > 0) {
      Object.assign(this.sponsors[0], data);
    }
    return this.sponsors[0];
  }

  // --- Auth & Users ---
  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public registerUser(
    name: string,
    email: string,
    phone: string,
    address: string,
    avatarType: any = 'fox',
    role: 'FREELANCER' | 'CLIENT' = 'FREELANCER',
    companyName?: string,
    companyWebsite?: string,
    industry?: string
  ): User {
    const nextId = `USER-${Date.now().toString().slice(-6)}`;
    const isClient = role === 'CLIENT';

    const newUser: User = {
      id: nextId,
      name,
      email,
      phone,
      address,
      bio: isClient
        ? `Verified Client & Employer on WEJOBS representing ${companyName || name}.`
        : 'Independent digital creator and freelance professional on WEJOBS.',
      avatar: avatarType,
      avatarType,
      role,
      companyName,
      companyWebsite,
      industry,
      escrowBalance: isClient ? 1000.0 : 0,
      totalJobsPosted: 0,
      emailVerified: true,
      paymentVerified: true,
      balanceAvailable: 0,
      balancePending: 0,
      balanceWithdrawn: 0,
      balanceEarned: 0,
      rating: 5.0,
      tasksCompleted: 0,
      tasksActive: 0,
      successRate: 100,
      onTimeRate: 100,
      acceptanceRate: 100,
      revisionRate: 0,
      fraudRiskScore: 0,
      fraudStatus: 'NORMAL',
      skills: isClient ? ['Talent Acquisition', 'Campaign Management'] : ['Writing', 'Research'],
      portfolio: [],
      savedTaskIds: [],
      createdAt: new Date().toISOString(),
    };

    this.users.set(newUser.id, newUser);
    this.addAuditLog(newUser.name, `USER_REGISTERED_${role}`, 'USER', newUser.id, { email, role, companyName });

    // Send Welcome Notification
    this.addNotification(
      newUser.id,
      'SYSTEM',
      'Selamat Datang di WEJOBS PRO!',
      'Akun Anda telah terverifikasi. Anda siap memilih dari 4,421+ tugas penulisan dan riset untuk mendapatkan imbalan saldo USD!',
      undefined
    );

    return newUser;
  }

  // --- Notifications System ---
  public getNotifications(userId?: string): NotificationItem[] {
    let list = Array.from(this.notifications.values());
    if (userId) {
      list = list.filter((n) => n.userId === userId || n.userId === 'ALL');
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(
    userId: string,
    type: NotificationItem['type'],
    title: string,
    message: string,
    amount?: number,
    metadata?: { taskId?: string; assignmentId?: string; withdrawalId?: string }
  ): NotificationItem {
    const notifId = `NOTIF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const notification: NotificationItem = {
      id: notifId,
      userId,
      type,
      title,
      message,
      amount,
      taskId: metadata?.taskId,
      assignmentId: metadata?.assignmentId,
      withdrawalId: metadata?.withdrawalId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(notifId, notification);
    return notification;
  }

  public markNotificationRead(notificationId: string): boolean {
    const notif = this.notifications.get(notificationId);
    if (!notif) return false;
    notif.read = true;
    return true;
  }

  public markAllNotificationsRead(userId: string): boolean {
    let count = 0;
    for (const notif of this.notifications.values()) {
      if (notif.userId === userId || notif.userId === 'ALL') {
        notif.read = true;
        count++;
      }
    }
    return count > 0;
  }

  public updateUser(userId: string, data: Partial<User>): User | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;
    Object.assign(user, data);
    return user;
  }

  public toggleSaveTask(userId: string, taskId: string): string[] {
    const user = this.users.get(userId);
    if (!user) return [];
    if (user.savedTaskIds.includes(taskId)) {
      user.savedTaskIds = user.savedTaskIds.filter((id) => id !== taskId);
    } else {
      user.savedTaskIds.push(taskId);
    }
    return user.savedTaskIds;
  }

  // --- Platform Statistics & Audit ---
  public getPlatformStats(): PlatformStats {
    let completedCount = 0;
    for (const u of this.users.values()) {
      completedCount += u.tasksCompleted;
    }
    return {
      registeredFreelancers: 14221,
      totalTasks: this.tasks.size, // 4,421
      totalPaidOut: '$1,728,000.00+ TELAH DI BAYARKAN',
      activeTasks: Array.from(this.tasks.values()).filter((t) => t.status === 'ACTIVE').length,
      completedTasks: 8940 + completedCount,
      communityReviewsCount: '2,300+ other reviews from our freelance community',
    };
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs.slice(-50).reverse();
  }

  public addAuditLog(actor: string, action: string, targetType: string, targetId: string, metadata?: Record<string, any>) {
    this.auditLogs.push({
      id: `AUDIT-${Date.now().toString().slice(-6)}`,
      actor,
      actorRole: actor.includes('ADMIN') ? 'ADMIN' : 'USER',
      action,
      targetType,
      targetId,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export const db = new Database();
