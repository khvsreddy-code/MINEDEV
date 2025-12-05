import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ControlPanel } from './ControlPanel';
import { Holodeck } from '../../three/Holodeck';
import { PipelineViz } from './PipelineViz';
import { StatsOverlay } from './StatsOverlay';

export const AetherSculpt = () => {
    const handleGenerate = (data) => {
        console.log('3D Generation requested:', data);
        // This will trigger the 3D generation pipeline
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] p-3 sm:p-4 md:p-6">
            <div className="max-w-[1920px] mx-auto">
                {/* Header */}
                <GlassCard className="mb-4 sm:mb-6 holographic">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white mb-2 uppercase tracking-wider text-glow">
                        🗿 AetherSculpt
                    </h2>
                    <p className="text-xs sm:text-sm font-mono text-emerald-400">
                        AI-Powered 3D Model Generation • Text/Image/Video-to-3D • Motion Transfer
                    </p>
                </GlassCard>

                {/* Main Content - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Control Panel - Sidebar */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <ControlPanel onGenerate={handleGenerate} />
                    </div>

                    {/* 3D Viewport - Main */}
                    <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
                        <GlassCard className="relative overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] cyber-lines">
                            {/* 3D Canvas */}
                            <Holodeck />

                            {/* Stats Overlay */}
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                                <StatsOverlay />
                            </div>

                            {/* Pipeline Viz */}
                            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
                                <PipelineViz />
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 border-l-2 border-emerald-500/50 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 border-r-2 border-emerald-500/50 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 border-l-2 border-emerald-500/50 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 border-r-2 border-emerald-500/50 pointer-events-none" />
                        </GlassCard>

                        {/* Feature Cards - Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            <GlassCard className="p-2 sm:p-3 text-center holographic">
                                <div className="text-lg sm:text-2xl mb-1">✨</div>
                                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 uppercase">AI Generated</div>
                                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500">Text/Image-to-3D</div>
                            </GlassCard>
                            <GlassCard className="p-2 sm:p-3 text-center holographic">
                                <div className="text-lg sm:text-2xl mb-1">🎬</div>
                                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-cyan-400 uppercase">Motion Transfer</div>
                                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500">Video-to-Animation</div>
                            </GlassCard>
                            <GlassCard className="p-2 sm:p-3 text-center holographic">
                                <div className="text-lg sm:text-2xl mb-1">🎨</div>
                                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-purple-400 uppercase">PBR Textures</div>
                                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500">4K Auto-Generated</div>
                            </GlassCard>
                            <GlassCard className="p-2 sm:p-3 text-center holographic">
                                <div className="text-lg sm:text-2xl mb-1">🦴</div>
                                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-rose-400 uppercase">Auto-Rigged</div>
                                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500">Animation Ready</div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
