import React from 'react';

export const StatsOverlay = ({ tris = 12480, materials = 3, bones = 24 }) => {
    return (
        <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-4 py-3 border border-emerald-500/30">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">TRIS</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">
                        {tris.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">MATS</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">{materials}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">RIG</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">{bones} bones</span>
                </div>
            </div>
        </div>
    );
};
