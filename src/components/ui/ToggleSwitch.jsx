import React from 'react';

export const ToggleSwitch = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg bg-slate-900/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 uppercase tracking-wider">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-11 sm:w-12 h-6 sm:h-7 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 neon-glow' : 'bg-slate-700'
                    }`}
            >
                <div
                    className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-5 sm:w-5 h-5 sm:h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${checked ? 'translate-x-5 sm:translate-x-5' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
};
