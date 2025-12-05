import React, { useState, useRef } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { ToggleSwitch } from '../../ui/ToggleSwitch';

export const ControlPanel = ({ onGenerate }) => {
    const [inputMode, setInputMode] = useState('text');
    const [prompt, setPrompt] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [generating, setGenerating] = useState(false);

    // Optimizations
    const [nanite, setNanite] = useState(true);
    const [autoRig, setAutoRig] = useState(true);
    const [pbrTexture, setPbrTexture] = useState(true);
    const [complexMotion, setComplexMotion] = useState(false);

    // Export
    const [exportFormat, setExportFormat] = useState('glb');
    const [targetPlatform, setTargetPlatform] = useState('pc');

    const fileInputRef = useRef(null);

    const inputModes = [
        { id: 'text', name: 'Text', icon: '📝', desc: 'Describe your 3D model' },
        { id: 'image', name: 'Image', icon: '🖼️', desc: 'Upload reference image' },
        { id: 'multiview', name: 'Multi-View', icon: '📐', desc: 'Front/Back/Left/Right' },
        { id: 'video', name: 'Video', icon: '🎬', desc: 'Motion transfer from video' },
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2),
                url: URL.createObjectURL(file)
            });
        }
    };

    const handleGenerate = async () => {
        if (!prompt && !uploadedFile) {
            alert('Please provide a text prompt or upload a file');
            return;
        }

        setGenerating(true);

        // Simulate generation process
        setTimeout(() => {
            console.log('Generating 3D model with:', {
                inputMode,
                prompt,
                uploadedFile,
                nanite,
                autoRig,
                pbrTexture,
                complexMotion,
                exportFormat,
                targetPlatform
            });

            if (onGenerate) {
                onGenerate({
                    inputMode,
                    prompt,
                    file: uploadedFile,
                    settings: { nanite, autoRig, pbrTexture, complexMotion },
                    export: { format: exportFormat, platform: targetPlatform }
                });
            }

            setGenerating(false);
            alert('🎉 3D Model Generated! (This is a demo - connect to actual AI API for real generation)');
        }, 2000);
    };

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-3 sm:space-y-4 pb-4">
            {/* Input Mode Selection */}
            <GlassCard>
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Input Method
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {inputModes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setInputMode(mode.id)}
                            className={`p-2 sm:p-3 rounded-lg font-mono text-[10px] sm:text-xs transition-all duration-300 ${inputMode === mode.id
                                    ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border border-emerald-500 text-emerald-400 neon-glow'
                                    : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:border-emerald-500/30'
                                }`}
                        >
                            <div className="text-lg sm:text-xl mb-1">{mode.icon}</div>
                            <div className="font-bold uppercase tracking-wider">{mode.name}</div>
                            <div className="text-[8px] sm:text-[9px] text-slate-500 mt-1">{mode.desc}</div>
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Text Input */}
            {inputMode === 'text' && (
                <GlassCard className="holographic">
                    <label className="terminal-text text-slate-400 mb-2 block">Semantic Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your 3D model... e.g., 'futuristic sci-fi robot with glowing blue armor and energy sword'"
                        className="w-full h-24 sm:h-32 bg-black/70 border border-emerald-500/30 rounded-lg p-3 text-xs sm:text-sm font-mono text-slate-300 placeholder-slate-600 focus:border-emerald-500 focus:outline-none resize-none cyber-lines"
                    />
                    <div className="mt-2 text-[9px] sm:text-[10px] font-mono text-emerald-500/60">
                        ✨ AI will generate a complete 3D model from your description
                    </div>
                </GlassCard>
            )}

            {/* Image/Video Upload */}
            {(inputMode === 'image' || inputMode === 'video' || inputMode === 'multiview') && (
                <GlassCard className="holographic">
                    <label className="terminal-text text-slate-400 mb-2 block">
                        {inputMode === 'multiview' ? 'Upload 4 Images (Front/Back/Left/Right)' :
                            inputMode === 'video' ? 'Upload Video for Motion Transfer' :
                                'Upload Reference Image'}
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={inputMode === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple={inputMode === 'multiview'}
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-500/40 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer cyber-lines"
                    >
                        {uploadedFile ? (
                            <div className="space-y-2">
                                <div className="text-4xl">✅</div>
                                <div className="text-xs sm:text-sm font-mono text-emerald-400">{uploadedFile.name}</div>
                                <div className="text-[9px] sm:text-[10px] font-mono text-slate-500">{uploadedFile.size} MB</div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadedFile(null);
                                    }}
                                    className="text-[9px] sm:text-xs text-rose-400 hover:text-rose-300"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                                    Drop {inputMode === 'video' ? 'video' : inputMode === 'multiview' ? 'images' : 'image'} here or click to browse
                                </span>
                            </>
                        )}
                    </div>

                    {inputMode === 'video' && (
                        <div className="mt-2 text-[9px] sm:text-[10px] font-mono text-cyan-500/60">
                            🎬 Extract motion from video and apply to generated model
                        </div>
                    )}
                </GlassCard>
            )}

            {/* Optimization Pipeline */}
            <GlassCard className="holographic">
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span>⚙️</span> Optimization Pipeline
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                    <ToggleSwitch label="Nanite Virtualization" checked={nanite} onChange={setNanite} />
                    <ToggleSwitch label="Auto-Rigging (Humanoid)" checked={autoRig} onChange={setAutoRig} />
                    <ToggleSwitch label="PBR Texturing (4K)" checked={pbrTexture} onChange={setPbrTexture} />
                    <ToggleSwitch label="Complex Motion Synthesis" checked={complexMotion} onChange={setComplexMotion} />
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[9px] sm:text-[10px] font-mono text-slate-500">
                    {nanite && '✓ Nanite '}
                    {autoRig && '✓ Rigged '}
                    {pbrTexture && '✓ Textured '}
                    {complexMotion && '✓ Animated '}
                    {!nanite && !autoRig && !pbrTexture && !complexMotion && 'No optimizations selected'}
                </div>
            </GlassCard>

            {/* Export Settings */}
            <GlassCard className="holographic">
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span>💾</span> Export Settings
                </h3>
                <div className="space-y-2 sm:space-y-3">
                    <div>
                        <label className="terminal-text text-slate-400 mb-1.5 block">Format</label>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="w-full bg-black/70 border border-emerald-500/30 rounded-lg p-2 text-xs sm:text-sm font-mono text-slate-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
                        >
                            <option value="glb">GLB (Recommended - Unity/Unreal)</option>
                            <option value="fbx">FBX (Animation Support)</option>
                            <option value="obj">OBJ (Universal)</option>
                            <option value="usd">USD (Pixar)</option>
                            <option value="stl">STL (3D Printing)</option>
                        </select>
                    </div>
                    <div>
                        <label className="terminal-text text-slate-400 mb-1.5 block">Target Platform</label>
                        <select
                            value={targetPlatform}
                            onChange={(e) => setTargetPlatform(e.target.value)}
                            className="w-full bg-black/70 border border-emerald-500/30 rounded-lg p-2 text-xs sm:text-sm font-mono text-slate-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
                        >
                            <option value="pc">PC (High Quality)</option>
                            <option value="mobile">Mobile (Optimized)</option>
                            <option value="vr">VR/AR</option>
                            <option value="web">WebGL</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Generate Button */}
            <GlassButton
                onClick={handleGenerate}
                className="w-full py-3 sm:py-4 neon-glow"
                disabled={generating}
            >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold">
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate 3D Model
                        </>
                    )}
                </span>
            </GlassButton>

            {/* Info Badge */}
            <div className="glass-dark rounded-lg p-2 sm:p-3 text-center border border-emerald-500/20">
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Ready for AI Integration • Local Processing • Zero-Cost
                </div>
            </div>
        </div>
    );
};
