/**
 * WEJOBS Master Types & Interfaces
 * Single source of truth for all domain entities.
 */

export type UserRole = 'FREELANCER' | 'CLIENT' | 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';

export type BuiltInAvatar = 'cat' | 'panda' | 'bear' | 'rabbit' | 'fox' | 'penguin' | 'hamster' | 'custom';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  skills?: string[];
  thumbnailUrl?: string;
  projectUrl?: string;
  url?: string;
  date?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  avatarType: BuiltInAvatar;
  role: UserRole;
  level?: number;
  joinedDate?: string;
  emailVerified: boolean;
  paymentVerified: boolean;
  paymentMethod?: string;
  paymentDetails?: string;
  balanceAvailable: number;
  balancePending: number;
  balanceWithdrawn: number;
  balanceEarned: number;
  rating: number;
  tasksCompleted: number;
  tasksActive: number;
  successRate: number;
  onTimeRate: number;
  acceptanceRate: number;
  revisionRate: number;
  fraudRiskScore: number;
  fraudStatus: 'NORMAL' | 'MONITOR' | 'REVIEW' | 'RESTRICTED';
  skills: string[];
  portfolio: PortfolioItem[];
  savedTaskIds: string[];
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  escrowBalance?: number;
  totalJobsPosted?: number;
  createdAt: string;
}

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type TaskStatus = 'ACTIVE' | 'FULL' | 'EXPIRED' | 'COMPLETED' | 'SUSPENDED' | 'DRAFT';

export interface Task {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtype: string;
  difficulty: TaskDifficulty;
  taskObjective: string;
  targetAudience: string;
  clientId?: string;
  clientDisplayName: string;
  clientRating: number;
  clientVerified: boolean;
  language: string;
  locale?: string;
  description: string;
  detailedInstructions: string[];
  expectedDeliverable: string;
  wordCountOrUnit: string;
  writingStyle?: string;
  tone?: string;
  requiredFormat: string;
  allowedFileTypes: string[];
  requirements: string[];
  forbiddenItems: string[];
  sourceRequirements?: string;
  originalityRequirement: string;
  plagiarismRule: string;
  acceptanceCriteria: string[];
  revisionPolicy: string;
  estimatedCompletionTime: string;
  paymentUSD: number;
  paymentBasis: string;
  deadline: string;
  capacity: number;
  currentSubmissions: number;
  remainingSlots: number;
  status: TaskStatus;
  createdAt: string;
  publishedAt: string;
}

export type AssignmentStatus =
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export interface TaskAssignment {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: string;
  taskPaymentUSD: number;
  taskDeadline: string;
  userId: string;
  userName?: string;
  userDisplayName: string;
  userEmail: string;
  userAvatar: string;
  status: AssignmentStatus;
  textSubmission?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  submissionFileUrl?: string;
  revisionNotes?: string;
  clientFeedback?: string;
  ratingGiven?: number;
  assignedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  deadlineAt: string;
  version: number;
}

export type TransactionType = 'TASK_REWARD' | 'BONUS' | 'CHALLENGE_REWARD' | 'WITHDRAWAL' | 'ADJUSTMENT';

export interface LedgerTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
  referenceId?: string;
  description: string;
  createdAt: string;
}

export type WithdrawalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'Bank Lokal' | 'PayPal' | 'Wise' | 'USDT';
  destinationDetails: string;
  accountHolderName: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  transactionId?: string;
  createdAt: string;
  processedAt?: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  displayName: string;
  avatar: string;
  joinedAt: string;
  score: number;
  rank: number;
  completedQualifyingTasks: number;
  rating: number;
  verificationStatus: 'PROVISIONAL' | 'VERIFIED' | 'DISQUALIFIED';
  fraudStatus: 'CLEAR' | 'UNDER_INVESTIGATION' | 'DISQUALIFIED';
}

export interface ChallengeReward {
  category: string;
  rankTitle: string;
  amount: number;
  winnerName?: string;
  winnerAvatar?: string;
  winnerCountry?: string;
  points?: number;
}

export interface MonthlyChallenge {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  period: string; // e.g. "August 2026"
  maxParticipants: number;
  registeredCount: number;
  remainingSlots: number;
  registrationStartAt: string;
  registrationEndAt: string;
  challengeStartAt: string;
  challengeEndAt: string;
  prizePool: number; // $1,700
  firstPrize: number; // $1,000
  status: 'REGISTRATION_OPEN' | 'ACTIVE' | 'VERIFYING' | 'COMPLETED';
  rules: string[];
  rewards: ChallengeReward[];
  previousChampions: {
    monthYear: string;
    winnerName: string;
    avatar: string;
    country: string;
    points: number;
    category: string;
    prize: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'TASK_APPROVED' | 'TASK_REJECTED' | 'TASK_REVISION' | 'WITHDRAWAL_PAID' | 'WITHDRAWAL_REJECTED' | 'CHALLENGE_WIN' | 'SECURITY_ALERT' | 'SYSTEM';
  title: string;
  message: string;
  amount?: number;
  taskId?: string;
  assignmentId?: string;
  withdrawalId?: string;
  read: boolean;
  createdAt: string;
}

export interface TestimonialReview {
  id: string;
  reviewerName: string;
  rating: number;
  country: string;
  workCategory: string;
  review: string;
  avatar: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  isFeatured?: boolean;
}

export type FaqItem = FAQItem;

export interface SupportTicketMessage {
  id: string;
  senderId?: string;
  senderName: string;
  senderRole?: 'USER' | 'SUPPORT';
  isStaff?: boolean;
  message: string;
  timestamp?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'PROCESSING' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED';
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SponsorPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  speedSeconds: number;
  direction: 'ltr' | 'rtl';
  pauseOnHover: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type AuditLogEntry = AuditLog;

export interface PlatformStats {
  registeredFreelancers: number;
  totalTasks: number;
  totalPaidOut: string; // "$1,728,000.00+ TELAH DI BAYARKAN"
  activeTasks: number;
  completedTasks: number;
  communityReviewsCount: string;
}
