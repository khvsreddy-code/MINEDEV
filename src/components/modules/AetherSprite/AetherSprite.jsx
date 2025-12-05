import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { SpriteGenerator } from './SpriteGenerator';
import { SpriteCanvas } from './SpriteCanvas';
import { SpriteTimeline } from './SpriteTimeline';
import { SpriteExporter } from './SpriteExporter';

export const AetherSprite = () => {
    const [activeTab, setActiveTab] = useState('generator');
    const [frames, setFrames] = useState([{ id: 1, duration: 100, data: null }]);
    const [currentFrame, setCurrentFrame] = useState(0);

    const tabs = [
        { id: 'generator', name: 'Generate', icon: '✨' },
        { id: 'editor', name: 'Edit', icon: '✏️' },
        { id: 'animate', name: 'Animate', icon: '🎬' },
        { id: 'export', name: 'Export', icon: '💾' },
    ];

    const handleSpriteGenerated = (data) => {
        console.log('Sprite generated with settings:', data);
        // In real implementation, this would call AI API and populate frames
        setActiveTab('editor');
    };

    const handleFrameUpdate = (frameData) => {
        const updatedFrames = [...frames];
        updatedFrames[currentFrame] = {
            ...updatedFrames[currentFrame],
            data: frameData
        };
        setFrames(updatedFrames);
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <GlassCard className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
                                AetherSprite
                            </h2>
                            <p className="text-sm font-mono text-slate-400">
                                AI-Powered Sprite Sheet Generation & Pixel Art Editor
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                            : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* Content Area */}
                {activeTab === 'generator' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <SpriteGenerator onSpriteGenerated={handleSpriteGenerated} />
                        </div>
                        <div className="col-span-2">
                            <GlassCard className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <h3 className="text-lg font-mono font-bold text-white mb-2">
                                        AI Sprite Generation
                                    </h3>
                                    <p className="text-sm font-mono text-slate-400 max-w-md">
                                        Describe your character or object and let AI generate animated sprites.
                                        Choose animation types, art styles, and frame counts.
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {activeTab === 'editor' && (
                    <div>
                        <SpriteCanvas
                            width={64}
                            height={64}
                            onFrameUpdate={handleFrameUpdate}
                        />
                        <div className="mt-4">
                            <SpriteTimeline
                                frames={frames}
                                currentFrame={currentFrame}
                                onFrameChange={setCurrentFrame}
                                onFramesUpdate={setFrames}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'animate' && (
                    <div>
                        <SpriteTimeline
                            frames={frames}
                            currentFrame={currentFrame}
                            onFrameChange={setCurrentFrame}
                            onFramesUpdate={setFrames}
                        />
                        <div className="mt-6">
                            <GlassCard>
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-mono font-bold text-white mb-4">
                                        Animation Timeline
                                    </h3>
                                    <p className="text-sm font-mono text-slate-400 mb-4">
                                        Manage your animation frames, adjust timing, and preview your sprite animation.
                                    </p>
                                    <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
                                        <div>
                                            <div className="text-emerald-400 text-2xl font-bold">{frames.length}</div>
                                            <div>Total Frames</div>
                                        </div>
                                        <div>
                                            <div className="text-emerald-400 text-2xl font-bold">
                                                {(frames.reduce((sum, f) => sum + f.duration, 0) / 1000).toFixed(2)}s
                                            </div>
                                            <div>Duration</div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <SpriteExporter frames={frames} />
                        </div>
                        <div className="col-span-2">
                            <GlassCard className="h-full flex items-center justify-center">
                                <div className="text-center max-w-lg">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-lg font-mono font-bold text-white mb-2">
                                        Export Your Sprites
                                    </h3>
                                    <p className="text-sm font-mono text-slate-400 mb-6">
                                        Export as sprite sheets (PNG), animated GIFs, MP4 videos, or individual frames.
                                        Choose layout, frame size, and include metadata for game engines.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                        <div className="glass-dark p-3 rounded-lg">
                                            <div className="text-emerald-400 mb-1">✓ Game Ready</div>
                                            <div className="text-slate-500">Unity, Godot, GameMaker</div>
                                        </div>
                                        <div className="glass-dark p-3 rounded-lg">
                                            <div className="text-emerald-400 mb-1">✓ Web Optimized</div>
                                            <div className="text-slate-500">Transparent PNGs, GIFs</div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
