import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';

export const SpriteExporter = ({ frames = [], spriteData }) => {
    const [format, setFormat] = useState('spritesheet');
    const [layout, setLayout] = useState('horizontal');
    const [frameSize, setFrameSize] = useState(64);
    const [exporting, setExporting] = useState(false);

    const formats = [
        { id: 'spritesheet', name: 'Sprite Sheet (PNG)', ext: '.png' },
        { id: 'frames', name: 'Individual Frames (ZIP)', ext: '.zip' },
        { id: 'gif', name: 'Animated GIF', ext: '.gif' },
        { id: 'video', name: 'MP4 Video', ext: '.mp4' },
    ];

    const layouts = [
        { id: 'horizontal', name: 'Horizontal' },
        { id: 'vertical', name: 'Vertical' },
        { id: 'grid', name: 'Grid (Auto)' },
    ];

    const handleExport = async () => {
        setExporting(true);

        // Simulate export process
        setTimeout(() => {
            console.log('Exporting:', { format, layout, frameSize, frames: frames.length });

            // In a real implementation, this would generate the actual file
            // For now, we'll just log the export settings

            alert(`Export would generate: ${format} with ${frames.length} frames`);
            setExporting(false);
        }, 1500);
    };

    const generatePreview = () => {
        if (format === 'spritesheet') {
            const cols = layout === 'horizontal' ? frames.length : layout === 'vertical' ? 1 : Math.ceil(Math.sqrt(frames.length));
            const rows = layout === 'horizontal' ? 1 : layout === 'vertical' ? frames.length : Math.ceil(frames.length / cols);

            return (
                <div className="grid gap-1 bg-slate-900/50 p-4 rounded-lg" style={{
                    gridTemplateColumns: `repeat(${cols}, ${frameSize}px)`,
                    width: 'fit-content'
                }}>
                    {frames.map((frame, i) => (
                        <div
                            key={i}
                            className="border border-emerald-500/20"
                            style={{ width: frameSize, height: frameSize }}
                        >
                            {frame.data && (
                                <img
                                    src={frame.data}
                                    alt={`Frame ${i + 1}`}
                                    className="w-full h-full object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            {/* Format Selection */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Export Format
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {formats.map((fmt) => (
                        <button
                            key={fmt.id}
                            onClick={() => setFormat(fmt.id)}
                            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${format === fmt.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                        >
                            {fmt.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Layout Options (for sprite sheet */}
            {format === 'spritesheet' && (
                <GlassCard>
                    <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                        Sprite Sheet Layout
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {layouts.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLayout(l.id)}
                                className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 ${layout === l.id
                                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                        : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                    }`}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>

                    <label className="terminal-text text-slate-400 mb-2 block">Frame Size: {frameSize}px</label>
                    <input
                        type="range"
                        min="32"
                        max="256"
                        step="32"
                        value={frameSize}
                        onChange={(e) => setFrameSize(parseInt(e.target.value))}
                        className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-600 mt-1">
                        <span>32px</span>
                        <span>256px</span>
                    </div>
                </GlassCard>
            )}

            {/* Preview */}
            {format === 'spritesheet' && frames.length > 0 && (
                <GlassCard>
                    <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                        Preview
                    </h3>
                    <div className="overflow-auto max-h-96">
                        {generatePreview()}
                    </div>
                    <div className="mt-3 text-xs font-mono text-slate-500 text-center">
                        {frames.length} frames • {layout} layout • {frameSize}x{frameSize}px per frame
                    </div>
                </GlassCard>
            )}

            {/* Export Settings */}
            <GlassCard>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Export Settings
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="terminal-text text-slate-400 mb-1 block">File Name</label>
                        <input
                            type="text"
                            defaultValue="sprite_animation"
                            className="w-full bg-black/50 border border-slate-700/50 rounded-lg p-2 text-sm font-mono text-slate-300 focus:border-emerald-500/50 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="terminal-text text-slate-400">Include Metadata (JSON)</span>
                        <input type="checkbox" className="accent-emerald-500" defaultChecked />
                    </div>

                    {format === 'gif' && (
                        <div>
                            <label className="terminal-text text-slate-400 mb-1 block">GIF Quality</label>
                            <select className="w-full bg-black/50 border border-slate-700/50 rounded-lg p-2 text-sm font-mono text-slate-300 focus:border-emerald-500/50 focus:outline-none">
                                <option>Low (Smaller File)</option>
                                <option>Medium</option>
                                <option>High (Best Quality)</option>
                            </select>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Export Button */}
            <GlassButton
                onClick={handleExport}
                className="w-full py-3"
                disabled={exporting || frames.length === 0}
            >
                <span className="flex items-center justify-center gap-2">
                    {exporting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export {formats.find(f => f.id === format)?.ext}
                        </>
                    )}
                </span>
            </GlassButton>

            {frames.length === 0 && (
                <div className="text-center text-sm font-mono text-slate-500 py-8">
                    No frames to export. Create frames in the Editor or Generator tabs first.
                </div>
            )}
        </div>
    );
};
