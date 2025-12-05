import React from 'react';

export const GlassButton = ({ children, onClick, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`glass-dark rounded-lg px-4 sm:px-6 py-2 sm:py-3 font-mono text-xs sm:text-sm uppercase tracking-widest text-emerald-400 
        hover:bg-emerald-500/20 hover:border-emerald-500 transition-all duration-300 border border-emerald-500/50 neon-glow
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent ${className}`}
        >
            {children}
        </button>
    );
};
