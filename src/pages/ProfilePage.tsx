import React, { useState } from 'react';
import {
  User as UserIcon,
  CheckCircle,
  PlusCircle,
  Trash2,
  Lock,
  ExternalLink,
  Building2,
  LogOut,
} from 'lucide-react';
import { BuiltInAvatar, PortfolioItem, User } from '../types';
import { api } from '../lib/api';
import { Avatar } from '../components/Avatar';

interface ProfilePageProps {
  currentUser: User | null;
  onUpdateUser: (user: User) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

const AVATARS: { type: BuiltInAvatar; label: string }[] = [
  { type: 'fox', label: 'Fox' },
  { type: 'cat', label: 'Cat' },
  { type: 'panda', label: 'Panda' },
  { type: 'bear', label: 'Bear' },
  { type: 'rabbit', label: 'Rabbit' },
  { type: 'penguin', label: 'Penguin' },
  { type: 'hamster', label: 'Hamster' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <UserIcon className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Log in to view your profile</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Access your personal workspace, wallet balance, and task records.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-xs shadow-md transition-all"
          >
            Log In to Account
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const isClient = currentUser.role === 'CLIENT';

  // Profile Form States
  const [name, setName] = useState(currentUser.name);
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(currentUser.companyWebsite || '');
  const [industry, setIndustry] = useState(currentUser.industry || 'Digital Content & SEO');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [avatarType, setAvatarType] = useState<BuiltInAvatar>(
    (currentUser.avatarType as BuiltInAvatar) || 'fox'
  );
  const [skillsStr, setSkillsStr] = useState(currentUser.skills.join(', '));
  const [paymentMethod, setPaymentMethod] = useState(currentUser.paymentMethod || 'PayPal');
  const [paymentDetails, setPaymentDetails] = useState(currentUser.paymentDetails || '');

  // Portfolio items (for freelancers)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(currentUser.portfolio || []);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const updated = await api.updateProfile(currentUser.id, {
        name,
        companyName: isClient ? companyName : undefined,
        companyWebsite: isClient ? companyWebsite : undefined,
        industry: isClient ? industry : undefined,
        bio,
        phone,
        address,
        avatar: avatarType,
        avatarType,
        skills,
        paymentMethod: paymentMethod as any,
        paymentDetails,
        portfolio,
      });
      onUpdateUser(updated);
      setStatusMsg('Profile successfully updated!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = () => {
    if (!newTitle.trim()) return;
    const item: PortfolioItem = {
      id: `PORT-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      url: newUrl.trim() || undefined,
      projectUrl: newUrl.trim() || undefined,
      category: 'Writing Sample',
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };
    setPortfolio([...portfolio, item]);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
  };

  const handleRemovePortfolio = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Profile Header Card */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-1">
          <Avatar type={(currentUser.avatarType as BuiltInAvatar) || 'fox'} size="lg" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.name}</h1>
              {isClient ? (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Verified Client / Employer
                </span>
              ) : currentUser.role === 'SUPER_ADMIN' ? (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Super Admin
                </span>
              ) : (
                <>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified Freelancer
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Level {currentUser.level || 1}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {currentUser.email} {isClient && currentUser.companyName ? ` • ${currentUser.companyName}` : ''}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
              {isClient ? (
                <>
                  <span>Escrow Funded: <strong className="text-amber-400">${(currentUser.escrowBalance || 4500).toFixed(2)} USD</strong></span>
                  <span>•</span>
                  <span>Active Campaigns: <strong className="text-white">{currentUser.tasksActive || 6}</strong></span>
                  <span>•</span>
                  <span>Hired Reviews: <strong className="text-white">{currentUser.tasksCompleted || 84}</strong></span>
                </>
              ) : (
                <>
                  <span>Completed Tasks: <strong className="text-white">{currentUser.tasksCompleted}</strong></span>
                  <span>•</span>
                  <span>Total Earned: <strong className="text-white">${currentUser.balanceEarned.toFixed(2)} USD</strong></span>
                  <span>•</span>
                  <span>Available Balance: <strong className="text-emerald-400">${currentUser.balanceAvailable.toFixed(2)} USD</strong></span>
                </>
              )}
              <span>•</span>
              <span>Member Since: <strong className="text-white">{currentUser.joinedDate || '2026'}</strong></span>
            </div>
          </div>
        </div>

        {/* Top Direct Logout Button */}
        {onLogout && (
          <div className="flex sm:flex-col items-center justify-center gap-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              title="Logout from account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Mascot Avatar Selection */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isClient ? 'Company Mascot / Avatar' : 'Choose Mascot Avatar'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {AVATARS.map((av) => (
              <button
                key={av.type}
                type="button"
                onClick={() => setAvatarType(av.type)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  avatarType === av.type
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-white/5 bg-[#0a0a0a] hover:border-white/20'
                }`}
              >
                <Avatar type={av.type} size="md" border={false} />
                <span className="text-xs font-semibold text-gray-300">{av.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isClient ? 'Company & Organization Details' : 'Personal & Contact Details'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">
                {isClient ? 'Representative Contact Name' : 'Full Legal Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            {isClient && (
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5">Company / Studio Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Starlight Digital Media"
                  className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">
                {isClient ? 'Headquarters Location' : 'Location / Address'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country"
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            {isClient && (
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5">Company Website</label>
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://domain.com"
                  className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          <div className="text-xs pt-2">
            <label className="block text-gray-300 font-semibold mb-1.5">
              {isClient ? 'Company Overview & Hiring Philosophy' : 'Professional Biography'}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs pt-2">
            <label className="block text-gray-300 font-semibold mb-1.5">
              {isClient ? 'Target Hiring Specialties (comma-separated)' : 'Skills & Core Competencies (comma-separated)'}
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment & Payout Method */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isClient ? 'Client Billing & Escrow Funding Method' : 'Payout & Financial Verification'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Payment Provider</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PayPal">PayPal (USD)</option>
                <option value="Wise">Wise (TransferWise)</option>
                <option value="Payoneer">Payoneer</option>
                <option value="Stripe / Card">Credit / Debit Card</option>
                <option value="Bank Wire">International Bank Wire</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Account ID / Address</label>
              <input
                type="text"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="billing@company.com or IBAN"
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Samples (for Freelancers) */}
        {!isClient && (
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Portfolio & Writing Samples ({portfolio.length})
              </h3>
            </div>

            {/* List existing */}
            <div className="space-y-3">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <strong className="text-white text-sm block">{item.title}</strong>
                    <p className="text-gray-400">{item.description}</p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 mt-1 font-mono text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.url}</span>
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolio(item.id)}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new sample */}
            <div className="pt-4 border-t border-white/5 space-y-3 text-xs">
              <h4 className="font-semibold text-gray-300">Add New Writing / Work Sample</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Sample Title (e.g. AI Ethics Research Article)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
                <input
                  type="url"
                  placeholder="Live Project / Google Doc URL (Optional)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Brief summary of work scope & techniques used..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddPortfolio}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Append to Portfolio</span>
              </button>
            </div>
          </div>
        )}

        {/* Account Security & Logout Section */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Account Security & Session Management</span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Manage your session credentials, client permissions, and active device logins securely.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <div>
              <strong className="text-xs font-bold text-white block">Log Out of Current Session</strong>
              <span className="text-[11px] text-gray-500">
                End your active authentication session on this device.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out / Keluar Akun</span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
          {onLogout && (
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </div>
      </form>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/25">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Konfirmasi Keluar Akun</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun <strong className="text-white">{currentUser.name}</strong> ({isClient ? 'Client' : 'Freelancer'})?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25"
              >
                Ya, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
