import React, { useState, useEffect } from 'react';
import { StatusLED } from '../ui/StatusLED';

export const Header = ({ activeModule, setActiveModule }) => {
    const [ramUsage, setRamUsage] = useState(2.4);
    const [vramUsage, setVramUsage] = useState(1.8);

    useEffect(() => {
        const interval = setInterval(() => {
            setRamUsage(prev => Math.min(8, Math.max(2, prev + (Math.random() - 0.5) * 0.3)));
            setVramUsage(prev => Math.min(4, Math.max(1, prev + (Math.random() - 0.5) * 0.2)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const modules = [
        { id: 'sculpt', name: 'AetherSculpt', icon: '🗿' },
        { id: 'sprite', name: 'AetherSprite', icon: '🎨' },
        { id: 'world', name: 'AetherWorld', icon: '🌍' },
        { id: 'dialog', name: 'AetherDialog', icon: '💬' },
        { id: 'code', name: 'AetherCode', icon: '⚡' },
        { id: 'metrics', name: 'AetherMetrics', icon: '📊' },
    ];

    return (
        <header className="sticky top-0 z-50 glass border-b border-emerald-500/30 cyber-lines">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-500 rounded-lg flex items-center justify-center neon-glow holographic">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" className="text-emerald-400" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" className="text-emerald-500" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-mono tracking-wider text-glow">
                                <span className="text-white">AETHERFORGE</span>
                                <span className="text-emerald-400"> NEXUS</span>
                            </h1>
                            <div className="text-[9px] sm:text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">
                                V15.2 - AI Game Dev Toolkit
                            </div>
                        </div>
                    </div>

                    {/* Navigation Pills */}
                    <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
                        {modules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => setActiveModule(module.id)}
                                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 ${activeModule === module.id
                                        ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-500 text-emerald-400 neon-glow'
                                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:border-emerald-500/30'
                                    }`}
                            >
                                <span className="hidden sm:inline mr-1">{module.icon}</span>
                                <span className="hidden md:inline">{module.name}</span>
                                <span className="md:hidden">{module.name.replace('Aether', '')}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Hardware Gauge */}
                    <div className="glass-dark rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 border border-emerald-500/40 holographic">
                        <StatusLED status="active" />
                        <div className="flex gap-2 sm:gap-4">
                            <div className="flex flex-col">
                                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider">RAM</span>
                                <span className={`text-[10px] sm:text-xs font-mono font-bold ${ramUsage > 6 ? 'text-amber-400' : 'text-emerald-400'} text-glow`}>
                                    {ramUsage.toFixed(1)}GB
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider">VRAM</span>
                                <span className={`text-[10px] sm:text-xs font-mono font-bold ${vramUsage > 3 ? 'text-amber-400' : 'text-emerald-400'} text-glow`}>
                                    {vramUsage.toFixed(1)}GB
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
