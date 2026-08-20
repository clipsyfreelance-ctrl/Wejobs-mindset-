import React, { useState } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({ isOpen, onClose, onVerified }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [verified, setVerified] = useState(false);
  const target = 75; // target position percentage

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    if (Math.abs(val - target) <= 5) {
      setVerified(true);
      setTimeout(() => {
        onVerified();
        onClose();
        setVerified(false);
        setSliderValue(0);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 shadow-2xl font-mono">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-orange-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Security Verification</h4>
        </div>
        <p className="text-xs text-slate-400 mb-5 font-sans">
          Slide the handle to fit the target piece and verify human interaction.
        </p>

        {/* Puzzle Box Graphic */}
        <div className="relative w-full h-32 bg-[#050505] border border-white/10 overflow-hidden mb-5 flex items-center">
          {/* Target Slot */}
          <div
            className="absolute top-8 w-12 h-16 border-2 border-dashed border-orange-500 bg-orange-500/10 flex items-center justify-center text-[10px] text-orange-400 font-black"
            style={{ left: `${target}%` }}
          >
            TARGET
          </div>
          {/* Draggable Piece */}
          <div
            className={`absolute top-8 w-12 h-16 bg-orange-500 shadow-lg flex items-center justify-center text-black font-black text-xs transition-transform ${
              verified ? 'scale-105 ring-2 ring-emerald-400 bg-emerald-400' : ''
            }`}
            style={{ left: `${sliderValue}%` }}
          >
            {verified ? <Check className="w-5 h-5 text-black stroke-[3]" /> : 'FIT'}
          </div>
        </div>

        {/* Slider control */}
        <div className="space-y-2 font-mono">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            disabled={verified}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-white/10 appearance-none"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-black">
            <span>Slide to target</span>
            <span className="text-white">{verified ? '✓ VERIFIED!' : `${sliderValue}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

