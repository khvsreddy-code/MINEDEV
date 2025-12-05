import React from 'react';

export const ProgressBar = ({ label, value, max, unit = '' }) => {
    const percentage = (value / max) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                <span className="terminal-text text-slate-400">{label}</span>
                <span className="terminal-text text-emerald-400">
                    {value}{unit} / {max}{unit}
                </span>
            </div>
            <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
