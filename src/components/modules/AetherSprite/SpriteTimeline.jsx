import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';

export const SpriteTimeline = ({ frames = [], onFramesUpdate, currentFrame = 0, onFrameChange }) => {
    const [localFrames, setLocalFrames] = useState(frames.length > 0 ? frames : [{ id: 1, duration: 100, data: null }]);
    const [playing, setPlaying] = useState(false);
    const [fps, setFps] = useState(10);
    const [onionSkin, setOnionSkin] = useState(false);

    useEffect(() => {
        if (frames.length > 0) {
            setLocalFrames(frames);
        }
    }, [frames]);

    useEffect(() => {
        if (!playing) return;

        const interval = setInterval(() => {
            onFrameChange((currentFrame + 1) % localFrames.length);
        }, 1000 / fps);

        return () => clearInterval(interval);
    }, [playing, currentFrame, localFrames.length, fps, onFrameChange]);

    const addFrame = () => {
        const newFrame = {
            id: Date.now(),
            duration: 100,
            data: null
        };
        const updated = [...localFrames, newFrame];
        setLocalFrames(updated);
        if (onFramesUpdate) onFramesUpdate(updated);
    };

    const duplicateFrame = (index) => {
        const frameToDupe = localFrames[index];
        const newFrame = {
            ...frameToDupe,
            id: Date.now()
        };
        const updated = [...localFrames.slice(0, index + 1), newFrame, ...localFrames.slice(index + 1)];
        setLocalFrames(updated);
        if (onFramesUpdate) onFramesUpdate(updated);
    };

    const deleteFrame = (index) => {
        if (localFrames.length <= 1) return; // Keep at least one frame
        const updated = localFrames.filter((_, i) => i !== index);
        setLocalFrames(updated);
        if (onFramesUpdate) onFramesUpdate(updated);
        if (currentFrame >= updated.length) {
            onFrameChange(updated.length - 1);
        }
    };

    const updateFrameDuration = (index, duration) => {
        const updated = localFrames.map((frame, i) =>
            i === index ? { ...frame, duration } : frame
        );
        setLocalFrames(updated);
        if (onFramesUpdate) onFramesUpdate(updated);
    };

    return (
        <GlassCard>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Timeline
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOnionSkin(!onionSkin)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs ${onionSkin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/20 text-slate-400'
                            }`}
                        title="Toggle Onion Skinning"
                    >
                        👻 Onion Skin
                    </button>
                </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => setPlaying(!playing)}
                    className="px-4 py-2 rounded-lg font-mono text-xs bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30"
                >
                    {playing ? '⏸ Pause' : '▶ Play'}
                </button>

                <button
                    onClick={() => onFrameChange(Math.max(0, currentFrame - 1))}
                    className="px-3 py-2 rounded-lg font-mono text-xs bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30"
                    disabled={currentFrame === 0}
                >
                    ◀
                </button>

                <div className="px-3 py-2 bg-black/50 rounded-lg font-mono text-xs text-emerald-400">
                    Frame {currentFrame + 1} / {localFrames.length}
                </div>

                <button
                    onClick={() => onFrameChange(Math.min(localFrames.length - 1, currentFrame + 1))}
                    className="px-3 py-2 rounded-lg font-mono text-xs bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30"
                    disabled={currentFrame === localFrames.length - 1}
                >
                    ▶
                </button>

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                    <span className="terminal-text text-slate-400">FPS: {fps}</span>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={fps}
                        onChange={(e) => setFps(parseInt(e.target.value))}
                        className="w-24 accent-emerald-500"
                    />
                </div>
            </div>

            {/* Frame Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {localFrames.map((frame, index) => (
                    <div
                        key={frame.id}
                        className={`flex-shrink-0 group ${currentFrame === index ? 'ring-2 ring-emerald-400' : ''
                            }`}
                    >
                        <button
                            onClick={() => onFrameChange(index)}
                            className={`w-20 h-20 rounded-lg border-2 transition-all ${currentFrame === index
                                    ? 'border-emerald-400 bg-emerald-900/20'
                                    : 'border-slate-700/50 bg-slate-900/50 hover:border-emerald-500/30'
                                }`}
                        >
                            {frame.data ? (
                                <img
                                    src={frame.data}
                                    alt={`Frame ${index + 1}`}
                                    className="w-full h-full object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                                    {index + 1}
                                </div>
                            )}
                        </button>

                        <div className="mt-1 text-center text-[9px] font-mono text-slate-500">
                            {frame.duration}ms
                        </div>

                        {/* Frame Controls */}
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 justify-center">
                            <button
                                onClick={() => duplicateFrame(index)}
                                className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono hover:bg-emerald-500/30"
                                title="Duplicate"
                            >
                                📋
                            </button>
                            <button
                                onClick={() => deleteFrame(index)}
                                className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-[9px] font-mono hover:bg-rose-500/30"
                                title="Delete"
                                disabled={localFrames.length <= 1}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Frame Button */}
                <button
                    onClick={addFrame}
                    className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-slate-700/50 bg-slate-900/30 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all flex items-center justify-center"
                >
                    <span className="text-2xl text-slate-600 group-hover:text-emerald-500">+</span>
                </button>
            </div>

            {/* Total Duration */}
            <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
                <div className="text-xs font-mono text-slate-400">
                    Total Duration: {localFrames.reduce((sum, f) => sum + f.duration, 0)}ms
                    <span className="mx-2">|</span>
                    Loop: {(localFrames.reduce((sum, f) => sum + f.duration, 0) / 1000).toFixed(2)}s @ {fps} FPS
                </div>
            </div>
        </GlassCard>
    );
};
