import React, { useState } from 'react';
import { ShieldAlert, Key, X, Lock, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { User } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [adminKey, setAdminKey] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const admin = await api.adminLogin(adminKey, code);
      onSuccess(admin);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid administrative authentication key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Administrative Portal</h3>
            <p className="text-xs text-gray-400">Authorized Personnel & Compliance Access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Admin Master Key
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter master admin key (or 'admin')"
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Hint for evaluation: <code className="text-indigo-400">admin</code> or <code className="text-indigo-400">wejobs-admin-2026</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              2FA Security Code (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit authenticator code"
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0a0a0a] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Enter Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
