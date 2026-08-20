import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { Task, User } from '../types';
import { api } from '../lib/api';
import { TaskCard } from '../components/TaskCard';

interface JobsPageProps {
  currentUser: User | null;
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
}

const CATEGORIES = [
  'All',
  'Article & Blog Writing',
  'SEO & Web Content',
  'Copywriting & Marketing',
  'Product & E-commerce Content',
  'Business & Professional Writing',
  'Creative Writing',
  'Script & Storytelling',
  'Editing & Proofreading',
  'Research & Summarization',
  'Translation & Localization',
  'Transcription & Subtitle Work',
  'Data Annotation & Classification',
  'Content Moderation & Quality Review',
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SORT_OPTIONS = [
  { id: 'newest', label: 'DEFAULT CATALOG ORDER' },
  { id: 'highest-reward', label: 'HIGHEST REWARD ($ USD)' },
  { id: 'lowest-reward', label: 'LOWEST REWARD ($ USD)' },
  { id: 'slots-available', label: 'MOST SLOTS AVAILABLE' },
  { id: 'deadline-soon', label: 'EXPIRING SOON' },
];

export const JobsPage: React.FC<JobsPageProps> = ({
  currentUser,
  onSelectTask,
  onOpenCreateTask,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(4421);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(222);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [savedIds, setSavedIds] = useState<string[]>(currentUser?.savedTaskIds || []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({
        page,
        limit,
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        sortBy,
        minPrice,
        maxPrice,
      });
      setTasks(res.tasks);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, category, difficulty, sortBy, minPrice, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTasks();
  };

  const handleToggleSave = async (task: Task) => {
    if (!currentUser) return;
    try {
      const updated = await api.toggleSaveTask(task.id, currentUser.id);
      setSavedIds(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-6 bg-orange-500"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-500 font-mono">
              VERIFIED TASK DIRECTORY
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white font-display">
              EXPLORE TASKS
            </h1>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-orange-500 text-black font-mono">
              {total.toLocaleString()} RECORDS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-2 max-w-xl">
            Browse verified assignments with guaranteed USD rewards and atomic slot reservation.
          </p>
        </div>

        {/* Action Button: Post Task Wizard */}
        <button
          onClick={onOpenCreateTask}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-200 text-black text-xs font-black uppercase tracking-widest transition-all self-start md:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Post Task</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-5">
        {/* Keyword Search */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY KEYWORDS, OBJECTIVE, OR CLIENT..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#050505] border border-white/15 text-xs font-bold uppercase tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest transition-all"
          >
            Search
          </button>
        </form>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap transition-all flex-shrink-0 border ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'bg-[#050505] text-slate-400 border-white/10 hover:text-white hover:border-white/25'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Difficulty, Sort & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap text-[10px]">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 text-xs font-bold uppercase"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap text-[10px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 text-xs font-bold uppercase"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap text-[10px]">Reward ($):</span>
            <input
              type="number"
              min="0"
              placeholder="MIN"
              value={minPrice ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                setMinPrice(v);
                setPage(1);
              }}
              className="w-1/2 px-3 py-2 bg-[#050505] border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-xs font-bold font-mono"
            />
            <input
              type="number"
              min="0"
              placeholder="MAX"
              value={maxPrice ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                setMaxPrice(v);
                setPage(1);
              }}
              className="w-1/2 px-3 py-2 bg-[#050505] border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-xs font-bold font-mono"
            />
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading catalog records...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-20 bg-[#0c0c0c] border border-white/10 text-center space-y-4 p-8">
          <p className="text-xl font-black uppercase text-white font-display">No matching tasks found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, price limits, or selecting a broader category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setDifficulty('All');
              setMinPrice(undefined);
              setMaxPrice(undefined);
              setPage(1);
            }}
            className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSaved={savedIds.includes(task.id)}
              onSelect={onSelectTask}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">
            Page <strong className="text-white font-black">{page}</strong> of <strong className="text-white font-black">{totalPages}</strong> ({total.toLocaleString()} total tasks)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2.5 bg-[#0e0e0e] border border-white/10 text-white hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Quick page jumps */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, page, page + 1, totalPages]
                .filter((p, idx, arr) => p >= 1 && p <= totalPages && arr.indexOf(p) === idx)
                .sort((a, b) => a - b)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-black transition-all border ${
                      page === p
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0e0e0e] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-2.5 bg-[#0e0e0e] border border-white/10 text-white hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

