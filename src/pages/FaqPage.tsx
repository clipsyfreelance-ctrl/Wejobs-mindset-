import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FaqItem } from '../types';
import { api } from '../lib/api';

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, 'yes' | 'no'>>({});
  const [loading, setLoading] = useState(true);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await api.getFaqs(search, selectedCat !== 'All' ? selectedCat : undefined);
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [search, selectedCat]);

  const categories = [
    'All',
    'General',
    'Registration & Profile',
    'Tasks & Assignments',
    'Submissions & Reviews',
    'Earnings & Wallet',
    'Withdrawals ($100 USD Min)',
    'Monthly Challenge',
  ];

  const handleVote = async (faqId: string, helpful: boolean) => {
    if (helpfulMap[faqId]) return;
    try {
      await api.voteFaq(faqId, helpful);
      setHelpfulMap((prev) => ({ ...prev, [faqId]: helpful ? 'yes' : 'no' }));
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === faqId
            ? {
                ...f,
                helpfulCount: (f.helpfulCount || 0) + (helpful ? 1 : 0),
                notHelpfulCount: (f.notHelpfulCount || 0) + (!helpful ? 1 : 0),
              }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Find instant answers to common questions regarding task claiming, deliverable reviews, $100 USD cashouts, and competition rules.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions by keywords (e.g. withdrawal, deadline, challenge, $100)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#161616] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-xl"
        />
        <Search className="w-5 h-5 text-gray-500 absolute left-4 top-4" />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((c) => {
          const active = selectedCat === c;
          return (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="py-16 bg-[#161616] border border-white/5 rounded-3xl text-center text-xs text-gray-500 p-6">
          No FAQs match your search query. Try different keywords.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const vote = helpfulMap[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-[#161616] border border-white/5 hover:border-white/15 rounded-3xl transition-all overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{faq.question}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-white/5 text-gray-400 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5 space-y-4 text-xs">
                    <p className="text-gray-400 leading-relaxed whitespace-pre-line text-sm">
                      {faq.answer}
                    </p>

                    {/* Was this helpful voting */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Was this answer helpful?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(faq.id, true)}
                          disabled={!!vote}
                          className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                            vote === 'yes'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-[#0a0a0a] text-gray-400 border-white/10 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Yes ({faq.helpfulCount ?? faq.helpfulVotes ?? 0})</span>
                        </button>
                        <button
                          onClick={() => handleVote(faq.id, false)}
                          disabled={!!vote}
                          className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                            vote === 'no'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-[#0a0a0a] text-gray-400 border-white/10 hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>No ({faq.notHelpfulCount ?? faq.unhelpfulVotes ?? 0})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
