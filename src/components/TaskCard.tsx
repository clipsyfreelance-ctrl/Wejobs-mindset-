import React from 'react';
import { Clock, Star, Users, Bookmark, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  isSaved?: boolean;
  onSelect: (task: Task) => void;
  onTakeJob?: (task: Task) => void;
  onToggleSave?: (task: Task) => void;
}

const DIFFICULTY_STYLES = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Advanced: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Expert: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSaved = false,
  onSelect,
  onTakeJob,
  onToggleSave,
}) => {
  const diffClass = DIFFICULTY_STYLES[task.difficulty] || DIFFICULTY_STYLES.Intermediate;
  const isFull = task.remainingSlots <= 0 || task.status === 'FULL';

  return (
    <div
      onClick={() => onSelect(task)}
      className="group relative bg-[#0e0e0e] hover:bg-[#151515] border border-white/10 hover:border-orange-500 p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Save Action */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1">
              {task.category}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 ${diffClass}`}>
              {task.difficulty}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(task);
            }}
            className={`p-2 border transition-colors ${
              isSaved
                ? 'bg-orange-500 text-black border-orange-500'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
            title={isSaved ? 'Remove from bookmarks' : 'Save task'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2 leading-snug font-display">
          {task.title}
        </h3>

        {/* Client & Subtype */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3 font-mono">
          <span className="font-bold text-slate-200 flex items-center gap-1 truncate max-w-[130px]">
            {task.clientDisplayName}
            {task.clientVerified && <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />}
          </span>
          <span>/</span>
          <div className="flex items-center gap-1 text-orange-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-bold">{task.clientRating.toFixed(1)}</span>
          </div>
          <span>/</span>
          <span className="text-slate-500 truncate uppercase text-[10px]">{task.subtype}</span>
        </div>

        {/* Short Objective */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-5 leading-relaxed font-normal">
          {task.taskObjective}
        </p>
      </div>

      {/* Footer Info: Estimated time, Slots & Reward */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5" title="Estimated completion time">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">{task.estimatedCompletionTime}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-bold ${
              isFull
                ? 'text-rose-400'
                : task.remainingSlots <= 5
                ? 'text-orange-400'
                : 'text-slate-400'
            }`}
            title="Remaining participant slots"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">
              {isFull ? 'FULL' : `${task.remainingSlots}/${task.capacity}`}
            </span>
          </div>
        </div>

        {/* Reward & Action */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-base font-black text-white font-mono">
              ${task.paymentUSD.toFixed(2)} <span className="text-[10px] text-orange-400 font-bold">USD</span>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-500 text-slate-400 flex items-center justify-center transition-all">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );
};

