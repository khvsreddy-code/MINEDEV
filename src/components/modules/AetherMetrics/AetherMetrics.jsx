import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressBar } from '../../ui/ProgressBar';

export const AetherMetrics = () => {
    return (
        <div className="w-full h-[calc(100vh-100px)] p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <GlassCard className="mb-6">
                    <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
                        AetherMetrics
                    </h2>
                    <p className="text-sm font-mono text-slate-400">
                        Telemetry & Performance Profiling
                    </p>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-sm font-mono font-bold text-white mb-6 uppercase tracking-wider">
                        System Resources
                    </h3>
                    <ProgressBar label="System Memory" value={2.4} max={8} unit="GB" />
                    <ProgressBar label="iGPU VRAM" value={1.8} max={4} unit="GB" />
                    <ProgressBar label="CPU Usage" value={42} max={100} unit="%" />
                    <ProgressBar label="Disk I/O" value={156} max={500} unit="MB/s" />
                </GlassCard>

                <GlassCard className="mt-6">
                    <h3 className="text-sm font-mono font-bold text-white mb-6 uppercase tracking-wider">
                        Docker Containers
                    </h3>
                    <ProgressBar label="AetherSculpt Worker" value={512} max={1024} unit="MB" />
                    <ProgressBar label="AetherWorld Worker" value={384} max={1024} unit="MB" />
                    <ProgressBar label="AetherCode Worker" value={256} max={1024} unit="MB" />
                </GlassCard>

                <GlassCard className="mt-6">
                    <h3 className="text-sm font-mono font-bold text-white mb-6 uppercase tracking-wider">
                        Worker Queue
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-dark rounded-lg p-4 border border-emerald-500/30">
                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                                Pending
                            </div>
                            <div className="text-3xl font-mono font-bold text-emerald-400">3</div>
                        </div>
                        <div className="glass-dark rounded-lg p-4 border border-emerald-500/30">
                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                                Processing
                            </div>
                            <div className="text-3xl font-mono font-bold text-amber-400">2</div>
                        </div>
                        <div className="glass-dark rounded-lg p-4 border border-emerald-500/30">
                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                                Completed
                            </div>
                            <div className="text-3xl font-mono font-bold text-slate-400">127</div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
