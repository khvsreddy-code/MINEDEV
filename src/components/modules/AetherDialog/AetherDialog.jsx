import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { CharacterProfiler } from './CharacterProfiler';

export const AetherDialog = () => {
    const [characterProfile, setCharacterProfile] = useState(null);
    const [dialogTree, setDialogTree] = useState(null);

    const handleGenerateDialog = () => {
        // Simulate AI generation
        console.log('Generating dialog for:', characterProfile);
        alert('Dialog AI generation would happen here. This connects to AI API for natural conversation generation.');
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <GlassCard className="mb-6">
                    <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
                        AetherDialog
                    </h2>
                    <p className="text-sm font-mono text-slate-400">
                        NPC Dialog Generator with Branching Conversations
                    </p>
                </GlassCard>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Character Profile Sidebar */}
                    <div className="col-span-1">
                        <CharacterProfiler onProfileUpdate={setCharacterProfile} />
                    </div>

                    {/* Dialog Tree Workspace */}
                    <div className="col-span-2">
                        <GlassCard className="min-h-[600px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                                    Dialog Tree Editor
                                </h3>
                                <button
                                    onClick={handleGenerateDialog}
                                    disabled={!characterProfile?.name}
                                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${characterProfile?.name
                                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 neon-glow'
                                            : 'bg-slate-700/20 border border-slate-700/50 text-slate-600 cursor-not-allowed'
                                        }`}
                                >
                                    ✨ Generate Dialog
                                </button>
                            </div>

                            {/* Placeholder for ReactFlow Dialog Tree */}
                            <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-12 text-center">
                                <div className="text-6xl mb-4">🗣️</div>
                                <h3 className="text-lg font-mono font-bold text-white mb-2">
                                    Visual Dialog Tree Editor
                                </h3>
                                <p className="text-sm font-mono text-slate-400 max-w-md mx-auto mb-6">
                                    {!characterProfile?.name
                                        ? 'Create a character profile first, then generate AI-powered dialog trees with branching conversations.'
                                        : 'Click "Generate Dialog" to create conversation nodes with branching choices, conditional logic, and quest integration.'}
                                </p>

                                {characterProfile?.name && (
                                    <div className="glass-dark rounded-lg p-4 max-w-sm mx-auto">
                                        <div className="text-xs font-mono text-slate-400 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Ready to generate for:</span>
                                                <span className="text-emerald-400">{characterProfile.name}</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-700/50 text-[10px] text-slate-600">
                                                Export formats: JSON, Yarn Spinner, Ink
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Quick Features Info */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <GlassCard className="p-3">
                                <div className="text-xs font-mono text-emerald-400 mb-1">✓ AI-Powered</div>
                                <div className="text-[10px] font-mono text-slate-500">Natural conversations</div>
                            </GlassCard>
                            <GlassCard className="p-3">
                                <div className="text-xs font-mono text-emerald-400 mb-1">✓ Branching</div>
                                <div className="text-[10px] font-mono text-slate-500">Player choices</div>
                            </GlassCard>
                            <GlassCard className="p-3">
                                <div className="text-xs font-mono text-emerald-400 mb-1">✓ Export Ready</div>
                                <div className="text-[10px] font-mono text-slate-500">Game engine formats</div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
