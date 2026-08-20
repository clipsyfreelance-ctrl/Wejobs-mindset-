import React, { useState } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { Task, User } from '../types';
import { api } from '../lib/api';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onTaskCreated: (task: Task) => void;
}

const CATEGORIES = [
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

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTaskCreated,
}) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subtype, setSubtype] = useState('Standard Deliverable');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [paymentUSD, setPaymentUSD] = useState('25.00');
  const [capacity, setCapacity] = useState('5');
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('2-4 hours');
  const [deadline, setDeadline] = useState('3 days from claim');
  const [taskObjective, setTaskObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('General Digital Audience');
  const [wordCountOrUnit, setWordCountOrUnit] = useState('1,200 words');
  const [requiredFormat, setRequiredFormat] = useState('Formatted Markdown (.md) or Clean Docx');
  const [writingStyle, setWritingStyle] = useState('Informative & Analytical');
  const [tone, setTone] = useState('Professional yet accessible');
  const [description, setDescription] = useState('');
  const [instructionsStr, setInstructionsStr] = useState(
    '1. Research topic thoroughly\n2. Maintain 100% original prose\n3. Proofread before final submission'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !taskObjective.trim()) {
      setError('Please fill in all required title and objective fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const instructions = instructionsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const task = await api.createTask({
        category,
        subtype,
        title: title.trim(),
        difficulty,
        paymentUSD: Number(paymentUSD) || 15.0,
        paymentBasis: `Fixed USD reward per approved deliverable`,
        capacity: Number(capacity) || 1,
        remainingSlots: Number(capacity) || 1,
        estimatedCompletionTime,
        deadline,
        taskObjective: taskObjective.trim(),
        targetAudience,
        wordCountOrUnit,
        requiredFormat,
        writingStyle,
        tone,
        description: description.trim() || taskObjective.trim(),
        detailedInstructions: instructions.length > 0 ? instructions : ['Follow standard guidelines.'],
        acceptanceCriteria: [
          'Zero plagiarism (100% original content)',
          'Meets stated word count & structure specifications',
          'Free of major grammatical or factual errors',
        ],
        forbiddenItems: [
          'Uncurated AI text spam',
          'Copied text from web pages without quotation',
          'Off-topic keyword stuffing',
        ],
        plagiarismRule: 'Strict 0% plagiarism tolerance. Originality checked automatically.',
        revisionPolicy: 'Up to 2 minor revision cycles permitted within 48 hours.',
        allowedFileTypes: ['docx', 'pdf', 'txt', 'md'],
        clientId: currentUser?.id || 'CLIENT-PORTAL',
        clientDisplayName: currentUser?.companyName || currentUser?.name || 'Verified Client',
        clientRating: 5.0,
        clientVerified: true,
        language: 'English / International',
      });

      onTaskCreated(task);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Task Creation Wizard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
            Post Micro-Task & Escrow
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Define clear deliverables, slot limits, and guaranteed USD reward for global contributors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-mono">
          {/* Category & Subtype */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 font-bold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Subtype / Specialization</label>
              <input
                type="text"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                placeholder="e.g. Long-form Deep Dive"
                className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-xs">
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Task Title (Punchy & Specific)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. In-Depth Technical Guide: Next-Gen Solar Panels"
              className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          {/* Reward & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">USD Reward ($)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                required
                value={paymentUSD}
                onChange={(e) => setPaymentUSD(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white font-black text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Total Slots</label>
              <input
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 font-bold"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Est. Time</label>
              <input
                type="text"
                value={estimatedCompletionTime}
                onChange={(e) => setEstimatedCompletionTime(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Objective & Description */}
          <div className="text-xs space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Task Objective</label>
              <textarea
                rows={2}
                required
                value={taskObjective}
                onChange={(e) => setTaskObjective(e.target.value)}
                placeholder="What is the key goal of this deliverable?"
                className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Word Count / Deliverable Unit</label>
                <input
                  type="text"
                  value={wordCountOrUnit}
                  onChange={(e) => setWordCountOrUnit(e.target.value)}
                  placeholder="e.g. 1,000 - 1,500 words"
                  className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Required File Format</label>
                <input
                  type="text"
                  value={requiredFormat}
                  onChange={(e) => setRequiredFormat(e.target.value)}
                  placeholder="e.g. Formatted Markdown or Word Document"
                  className="w-full p-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Step-by-Step Instructions (One per line)
              </label>
              <textarea
                rows={3}
                value={instructionsStr}
                onChange={(e) => setInstructionsStr(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-white/15 text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[3]" />
              <span>{submitting ? 'Creating...' : 'Publish Task (Lock Escrow)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
