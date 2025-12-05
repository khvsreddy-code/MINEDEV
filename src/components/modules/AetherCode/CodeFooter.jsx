import React from 'react';
import { GlassCard } from '../../ui/GlassCard';

export const CodeFooter = () => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <GlassCard className="p-4">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Complexity Analysis
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400">O(n)</div>
                <div className="text-xs font-mono text-slate-400 mt-1">Linear Time</div>
            </GlassCard>

            <GlassCard className="p-4">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Unit Test Generation
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full pulse-led" />
                    <span className="text-lg font-mono font-bold text-emerald-400">PASS</span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">3 tests generated</div>
            </GlassCard>
        </div>
    );
};
