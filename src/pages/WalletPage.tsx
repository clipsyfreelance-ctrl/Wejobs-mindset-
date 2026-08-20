import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Clock,
  X,
} from 'lucide-react';
import { LedgerTransaction, User, WithdrawalRequest } from '../types';
import { api } from '../lib/api';

interface WalletPageProps {
  currentUser: User | null;
  onRefreshUser: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  currentUser,
  onRefreshUser,
  onOpenAuth,
}) => {
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Cashout Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Lokal' | 'PayPal' | 'Wise' | 'USDT'>('PayPal');
  const [accountHolderName, setAccountHolderName] = useState(currentUser?.name || '');
  const [destinationDetails, setDestinationDetails] = useState(currentUser?.paymentDetails || '');
  const [withdrawing, setWithdrawing] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const loadWalletData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [txs, wds] = await Promise.all([
        api.getTransactions(currentUser.id),
        api.getWithdrawals(currentUser.id),
      ]);
      setTransactions(txs);
      setWithdrawals(wds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
          AUTHENTICATION REQUIRED
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
          LOG IN TO VIEW WALLET
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Track balance earnings, double-entry financial ledger, and request verified USD cashouts.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    const numAmount = Number(amount);

    // STRICT VALIDATION: $100 MINIMUM WITHDRAWAL
    if (numAmount < 100.0) {
      setModalError('Minimum withdrawal is strictly $100.00 USD.');
      return;
    }
    if (numAmount > currentUser.balanceAvailable) {
      setModalError(`Insufficient available balance ($${currentUser.balanceAvailable.toFixed(2)} USD available).`);
      return;
    }
    if (!destinationDetails.trim() || !accountHolderName.trim()) {
      setModalError('Please provide your complete destination account details and legal account holder name.');
      return;
    }

    setWithdrawing(true);
    try {
      const res = await api.requestWithdrawal({
        userId: currentUser.id,
        amount: numAmount,
        paymentMethod,
        destinationDetails,
        accountHolderName,
      });
      if (res.success) {
        setModalSuccess('Permintaan penarikan berhasil dikirim! Menunggu konfirmasi Admin terlebih dahulu sebelum dana ditransfer.');
        onRefreshUser();
        setTimeout(() => {
          setWithdrawModalOpen(false);
          loadWalletData();
        }, 1500);
      }
    } catch (err: any) {
      setModalError(err.message || 'Failed to process withdrawal.');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-6 bg-orange-500"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              DOUBLE-ENTRY ACCOUNTING LEDGER
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white font-display mt-2">
            WALLET & EARNINGS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Immutable transaction records, balance tracking, and secure USD payouts.
          </p>
        </div>
        <button
          onClick={() => {
            setAmount(currentUser.balanceAvailable >= 100 ? String(currentUser.balanceAvailable) : '100');
            setModalError('');
            setModalSuccess('');
            setWithdrawModalOpen(true);
          }}
          disabled={currentUser.balanceAvailable < 100}
          className={`px-8 py-4 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 self-start sm:self-auto ${
            currentUser.balanceAvailable >= 100
              ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 active:scale-95'
              : 'bg-[#141414] text-slate-500 border border-white/10 cursor-not-allowed'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          <span>Request Cash Out (Min $100)</span>
        </button>
      </div>

      {/* 4 Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-[#0e0e0e] border border-white/10 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-mono">Available Balance</span>
            <div className="w-7 h-7 bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${currentUser.balanceAvailable.toFixed(2)}{' '}
            <span className="text-xs text-orange-400 font-bold">USD</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono uppercase">
            <span>Threshold: $100.00</span>
            {currentUser.balanceAvailable >= 100 ? (
              <span className="text-emerald-400 font-bold">✓ Ready</span>
            ) : (
              <span className="text-orange-400">${(100 - currentUser.balanceAvailable).toFixed(2)} Left</span>
            )}
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-[#0e0e0e] border border-white/10 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-mono">Pending Review</span>
            <div className="w-7 h-7 bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${currentUser.balancePending.toFixed(2)}{' '}
            <span className="text-xs text-slate-500 font-bold">USD</span>
          </div>
          <span className="text-[10px] text-slate-500 block pt-1 font-mono uppercase">
            In review queue
          </span>
        </div>

        {/* Total Earned */}
        <div className="bg-[#0e0e0e] border border-white/10 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-mono">Lifetime Earned</span>
            <div className="w-7 h-7 bg-white/5 text-slate-300 flex items-center justify-center border border-white/10">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${currentUser.balanceEarned.toFixed(2)}{' '}
            <span className="text-xs text-slate-500 font-bold">USD</span>
          </div>
          <span className="text-[10px] text-slate-500 block pt-1 font-mono uppercase">
            {currentUser.tasksCompleted} Completed Deliverables
          </span>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-[#0e0e0e] border border-white/10 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-mono">Total Withdrawn</span>
            <div className="w-7 h-7 bg-white/5 text-slate-300 flex items-center justify-center border border-white/10">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${currentUser.balanceWithdrawn.toFixed(2)}{' '}
            <span className="text-xs text-slate-500 font-bold">USD</span>
          </div>
          <span className="text-[10px] text-slate-500 block pt-1 font-mono uppercase">
            Disbursed via Channels
          </span>
        </div>
      </div>

      {/* Withdrawal Progress Bar */}
      <div className="bg-[#0e0e0e] border border-white/10 p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold uppercase tracking-wider text-white text-[11px]">Withdrawal Threshold ($100.00 USD)</span>
          <span className="text-orange-400 font-black">
            {Math.min(100, Math.round((currentUser.balanceAvailable / 100) * 100))}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#050505] border border-white/10">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (currentUser.balanceAvailable / 100) * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 font-normal">
          To maintain financial security and zero processing fees, WEJOBS requires a minimum accumulated balance of $100.00 USD per withdrawal.
        </p>
      </div>

      {/* Withdrawal History Section */}
      {withdrawals.length > 0 && (
        <div className="bg-[#0e0e0e] border border-white/10 p-6 sm:p-7 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
            WITHDRAWAL REQUEST HISTORY
          </h3>
          <div className="divide-y divide-white/10">
            {withdrawals.map((w) => (
              <div key={w.id} className="py-4 flex items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white font-black">${w.amount.toFixed(2)} USD</strong>
                    <span className="text-slate-400 uppercase text-[10px]">VIA {w.paymentMethod}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Account: {w.destinationDetails} • <span className="font-mono text-slate-400">{w.id}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${
                      w.status === 'PAID'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                    }`}
                  >
                    {w.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ledger Transactions Table */}
      <div className="bg-[#0e0e0e] border border-white/10 p-6 sm:p-7 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
          IMMUTABLE LEDGER TRANSACTIONS
        </h3>
        {transactions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-mono uppercase">No transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 border-b border-white/10 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.id}</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 text-orange-400 border border-white/10">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-xs truncate font-sans text-xs">{tx.description}</td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right font-black whitespace-nowrap">
                      <span className={tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cash Out Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 font-mono">
                USD DISBURSEMENT
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-white font-display">
                REQUEST CASH OUT
              </h3>
              <p className="text-xs text-slate-400">
                Disbursement minimum is strictly $100.00 USD. Processed within 24-48 hours.
              </p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 font-mono">
              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Amount (USD) • Available: ${currentUser.balanceAvailable.toFixed(2)}
                </label>
                <input
                  type="number"
                  min="100"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3.5 bg-[#050505] border border-white/15 text-sm text-white font-black focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Payment Channel */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Payout Channel
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full p-3.5 bg-[#050505] border border-white/15 text-xs font-bold uppercase text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="PayPal">PayPal (Global USD)</option>
                  <option value="Bank Lokal">Bank Lokal (Indonesia / Direct Wire)</option>
                  <option value="Wise">Wise (Direct Currency Transfer)</option>
                  <option value="USDT">USDT (Tether TRC-20 / ERC-20)</option>
                </select>
              </div>

              {/* Legal Account Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Recipient Legal Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-3.5 bg-[#050505] border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Destination Details */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Destination Details (Email / Account / Address)
                </label>
                <input
                  type="text"
                  required
                  value={destinationDetails}
                  onChange={(e) => setDestinationDetails(e.target.value)}
                  placeholder="e.g. alex.morgan@paymenthub.com or Bank Account #"
                  className="w-full p-3.5 bg-[#050505] border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {modalError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                  {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                  ✓ {modalSuccess}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing}
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-md disabled:opacity-50"
                >
                  {withdrawing ? 'Submitting...' : 'Confirm $100+ Cashout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

