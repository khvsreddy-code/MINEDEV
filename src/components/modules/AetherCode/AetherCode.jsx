import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { TerminalWindow } from './TerminalWindow';
import { CodeFooter } from './CodeFooter';

export const AetherCode = () => {
    return (
        <div className="w-full h-[calc(100vh-100px)] p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <GlassCard className="mb-6">
                    <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
                        AetherCode
                    </h2>
                    <p className="text-sm font-mono text-slate-400">
                        Hyper-Contextual Code Generation & DevSecOps
                    </p>
                </GlassCard>

                <TerminalWindow />
                <CodeFooter />
            </div>
        </div>
    );
};
