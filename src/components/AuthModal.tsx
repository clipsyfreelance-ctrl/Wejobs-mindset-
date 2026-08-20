import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api';
import { BuiltInAvatar, User } from '../types';
import { Avatar } from './Avatar';
import { CaptchaModal } from './CaptchaModal';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarType, setAvatarType] = useState<BuiltInAvatar>('fox');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the human security verification puzzle first.');
      setCaptchaOpen(true);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        if (!email.trim()) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        const user = await api.login(email.trim(), true);
        onSuccess(user);
        onClose();
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (!termsAccepted || !privacyAccepted) {
          setError('You must accept the Terms of Service and Platform Policies.');
          setLoading(false);
          return;
        }

        const user = await api.register({
          name: name.trim() || 'Freelance Member',
          email: email.trim(),
          phone: phone.trim() || '+1 (555) 019-2831',
          address: address.trim() || 'Global Remote Workplace',
          avatarType,
          role: 'FREELANCER',
          captchaVerified: true,
        });
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-lg bg-[#0e0e10] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mode Tabs (Login vs Register) */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`pb-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                mode === 'login'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Freelancer Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`pb-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ml-4 flex items-center gap-2 ${
                mode === 'register'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Phone & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Address / Country</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Jakarta, Indonesia"
                        className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* 7 Built-In Avatars Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Select Profile Mascot
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.type}
                        type="button"
                        onClick={() => setAvatarType(av.type)}
                        className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                          avatarType === av.type
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-white/10 bg-[#161618] hover:border-white/20'
                        }`}
                      >
                        <Avatar type={av.type} size="sm" border={false} />
                        <span className="text-[9px] text-slate-400 font-bold">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div className={mode === 'register' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-3 bg-[#161618] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Human Verification Puzzle Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCaptchaOpen(true)}
                className={`w-full py-3.5 px-4 border rounded-xl flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-colors ${
                  captchaVerified
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/15 bg-[#161618] text-slate-300 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${captchaVerified ? 'text-emerald-400' : 'text-orange-400'}`} />
                  <span>
                    {captchaVerified ? 'HUMAN VERIFIED' : 'HUMAN VERIFICATION (PUZZLE)'}
                  </span>
                </div>
                {captchaVerified ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-orange-400 font-bold">CLICK TO VERIFY</span>
                )}
              </button>
            </div>

            {/* Checkboxes for Register */}
            {mode === 'register' && (
              <div className="space-y-2 pt-1 text-xs text-slate-400 font-sans">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="accent-orange-500 mt-0.5"
                  />
                  <span>I agree to the WEJOBS Terms of Service and Editorial Standards.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="accent-orange-500 mt-0.5"
                  />
                  <span>I accept the Privacy Policy and acknowledge USD payout & verification rules.</span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-sans">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 rounded-xl text-black font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In To Account'
                : 'Complete Freelancer Registration'}
            </button>
          </form>
        </div>
      </div>

      <CaptchaModal
        isOpen={captchaOpen}
        onClose={() => setCaptchaOpen(false)}
        onVerified={() => setCaptchaVerified(true)}
      />
    </>
  );
};

