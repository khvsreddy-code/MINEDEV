import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';

export const SpriteGenerator = ({ onSpriteGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [animType, setAnimType] = useState('idle');
    const [artStyle, setArtStyle] = useState('pixel');
    const [frameCount, setFrameCount] = useState(8);
    const [generating, setGenerating] = useState(false);

    const animationTypes = [
        { id: 'idle', name: 'Idle Stand' },
        { id: 'walk', name: 'Walk Cycle' },
        { id: 'run', name: 'Run Cycle' },
        { id: 'jump', name: 'Jump' },
        { id: 'attack', name: 'Attack' },
        { id: 'death', name: 'Death' },
        { id: 'cast', name: 'Spell Cast' },
    ];

    const artStyles = [
        { id: 'pixel', name: 'Pixel Art' },
        { id: 'cartoon', name: 'Cartoon' },
        { id: 'realistic', name: 'Realistic' },
        { id: 'isometric', name: 'Isometric' },
        { id: 'chibi', name: 'Chibi' },
    ];

    const handleGenerate = async () => {
        setGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            console.log('Generating sprite:', { prompt, animType, artStyle, frameCount });
            setGenerating(false);
            if (onSpriteGenerated) {
                onSpriteGenerated({ prompt, animType, artStyle, frameCount });
            }
        }, 2000);
    };

    return (
        <div className="space-y-4">
            {/* Prompt Input */}
            <GlassCard>
                <label className="terminal-text text-slate-400 mb-2 block">Character/Object Description</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your sprite... (e.g., 'fantasy knight with blue armor and glowing sword')"
                    className="w-full h-24 bg-black/50 border border-slate-700/50 rounded-lg p-3 text-sm font-mono text-slate-300 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none resize-none"
                />
            </GlassCard>

            {/* Animation Type */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Animation Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {animationTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setAnimType(type.id)}
                            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${animType === type.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Art Style */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Art Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {artStyles.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setArtStyle(style.id)}
                            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${artStyle === style.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            {style.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Frame Count */}
            <GlassCard>
                <label className="terminal-text text-slate-400 mb-2 block">Frame Count: {frameCount}</label>
                <input
                    type="range"
                    min="4"
                    max="32"
                    value={frameCount}
                    onChange={(e) => setFrameCount(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs font-mono text-slate-600 mt-1">
                    <span>4</span>
                    <span>32</span>
                </div>
            </GlassCard>

            {/* Generate Button */}
            <GlassButton
                onClick={handleGenerate}
                className="w-full py-3"
                disabled={generating || !prompt}
            >
                <span className="flex items-center justify-center gap-2">
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate Sprite
                        </>
                    )}
                </span>
            </GlassButton>
        </div>
    );
};
