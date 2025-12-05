import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';

export const CharacterProfiler = ({ onProfileUpdate }) => {
    const [characterData, setCharacterData] = useState({
        name: '',
        role: 'quest_giver',
        personality: [],
        background: '',
        tone: 'friendly',
    });

    const roles = [
        { id: 'quest_giver', name: 'Quest Giver', icon: '📜' },
        { id: 'merchant', name: 'Merchant', icon: '🏪' },
        { id: 'companion', name: 'Companion', icon: '🤝' },
        { id: 'villain', name: 'Villain', icon: '😈' },
        { id: 'civilian', name: 'Civilian', icon: '👤' },
    ];

    const personalities = [
        'Brave', 'Cowardly', 'Wise', 'Impulsive', 'Cunning',
        'Honest', 'Deceitful', 'Cheerful', 'Grumpy', 'Mysterious',
    ];

    const tones = [
        { id: 'friendly', name: 'Friendly' },
        { id: 'hostile', name: 'Hostile' },
        { id: 'mysterious', name: 'Mysterious' },
        { id: 'comedic', name: 'Comedic' },
        { id: 'serious', name: 'Serious' },
    ];

    const togglePersonality = (trait) => {
        setCharacterData(prev => ({
            ...prev,
            personality: prev.personality.includes(trait)
                ? prev.personality.filter(t => t !== trait)
                : [...prev.personality, trait]
        }));
    };

    const handleUpdate = () => {
        if (onProfileUpdate) onProfileUpdate(characterData);
    };

    return (
        <div className="space-y-4">
            {/* Character Name */}
            <GlassCard>
                <label className="terminal-text text-slate-400 mb-2 block">Character Name</label>
                <input
                    type="text"
                    value={characterData.name}
                    onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                    placeholder="e.g., Eldrin the Wise"
                    className="w-full bg-black/50 border border-slate-700/50 rounded-lg p-3 text-sm font-mono text-slate-300 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
                />
            </GlassCard>

            {/* Role Selection */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    NPC Role
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setCharacterData({ ...characterData, role: role.id })}
                            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${characterData.role === role.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            <span className="text-lg mr-2">{role.icon}</span>
                            {role.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Personality Traits */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Personality Traits
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {personalities.map((trait) => (
                        <button
                            key={trait}
                            onClick={() => togglePersonality(trait)}
                            className={`px-3 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${characterData.personality.includes(trait)
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            {trait}
                        </button>
                    ))}
                </div>
                <div className="mt-2 text-xs font-mono text-slate-500">
                    Selected: {characterData.personality.length > 0 ? characterData.personality.join(', ') : 'None'}
                </div>
            </GlassCard>

            {/* Background Story */}
            <GlassCard>
                <label className="terminal-text text-slate-400 mb-2 block">Background Story (Optional)</label>
                <textarea
                    value={characterData.background}
                    onChange={(e) => setCharacterData({ ...characterData, background: e.target.value })}
                    placeholder="Provide context and backstory for the character..."
                    className="w-full h-24 bg-black/50 border border-slate-700/50 rounded-lg p-3 text-sm font-mono text-slate-300 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none resize-none"
                />
            </GlassCard>

            {/* Tone */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Dialog Tone
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {tones.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => setCharacterData({ ...characterData, tone: tone.id })}
                            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${characterData.tone === tone.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            {tone.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Character Summary */}
            {characterData.name && (
                <GlassCard className="bg-emerald-900/10">
                    <h3 className="text-sm font-mono font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                        Character Summary
                    </h3>
                    <div className="text-xs font-mono text-slate-300 space-y-1">
                        <div><span className="text-slate-500">Name:</span> {characterData.name}</div>
                        <div><span className="text-slate-500">Role:</span> {roles.find(r => r.id === characterData.role)?.name}</div>
                        <div><span className="text-slate-500">Personality:</span> {characterData.personality.join(', ') || 'None set'}</div>
                        <div><span className="text-slate-500">Tone:</span> {tones.find(t => t.id === characterData.tone)?.name}</div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};
