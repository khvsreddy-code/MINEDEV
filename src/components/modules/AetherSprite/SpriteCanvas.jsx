import React, { useRef, useEffect, useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';

export const SpriteCanvas = ({ width = 64, height = 64, onFrameUpdate }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [tool, setTool] = useState('pencil');
    const [color, setColor] = useState('#10b981');
    const [zoom, setZoom] = useState(8);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showGrid, setShowGrid] = useState(true);

    const tools = [
        { id: 'pencil', name: 'Pencil', icon: '✏️' },
        { id: 'eraser', name: 'Eraser', icon: '🧹' },
        { id: 'fill', name: 'Fill', icon: '🪣' },
        { id: 'picker', name: 'Eyedropper', icon: '💧' },
    ];

    const colorPalette = [
        '#000000', '#FFFFFF', '#10b981', '#3b82f6', '#ef4444',
        '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#fbbf24',
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d', { willReadFrequently: true });
            setCtx(context);

            // Initialize with white background
            context.fillStyle = '#000000';
            context.fillRect(0, 0, width, height);
        }
    }, [width, height]);

    useEffect(() => {
        if (ctx && showGrid) {
            drawGrid();
        }
    }, [ctx, zoom, showGrid]);

    const drawGrid = () => {
        if (!ctx) return;
        const canvas = canvasRef.current;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= width; x++) {
            ctx.beginPath();
            ctx.moveTo(x * zoom, 0);
            ctx.lineTo(x * zoom, height * zoom);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * zoom);
            ctx.lineTo(width * zoom, y * zoom);
            ctx.stroke();
        }
    };

    const getPixelCoords = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / zoom);
        const y = Math.floor((e.clientY - rect.top) / zoom);
        return { x, y };
    };

    const drawPixel = (x, y, pixelColor = color) => {
        if (!ctx || x < 0 || x >= width || y < 0 || y >= height) return;

        ctx.fillStyle = pixelColor;
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom);

        if (onFrameUpdate) {
            onFrameUpdate(canvasRef.current.toDataURL());
        }
    };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y } = getPixelCoords(e);

        if (tool === 'pencil') {
            drawPixel(x, y);
        } else if (tool === 'eraser') {
            drawPixel(x, y, '#000000');
        } else if (tool === 'picker') {
            const imageData = ctx.getImageData(x * zoom, y * zoom, 1, 1);
            const [r, g, b] = imageData.data;
            setColor(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const { x, y } = getPixelCoords(e);

        if (tool === 'pencil') {
            drawPixel(x, y);
        } else if (tool === 'eraser') {
            drawPixel(x, y, '#000000');
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (!ctx) return;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width * zoom, height * zoom);
    };

    return (
        <div className="flex gap-4">
            {/* Tools Panel */}
            <GlassCard className="w-64">
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Tools
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id)}
                            className={`px-3 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${tool === t.id
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 neon-glow'
                                    : 'bg-slate-700/20 border border-slate-700/50 text-slate-400 hover:bg-slate-700/30'
                                }`}
                            title={t.name}
                        >
                            <div className="text-lg mb-1">{t.icon}</div>
                            <div className="text-[9px] uppercase">{t.name}</div>
                        </button>
                    ))}
                </div>

                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Color
                </h3>
                <div className="mb-3">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <div className="text-xs font-mono text-emerald-400 mt-1 text-center">{color}</div>
                </div>

                <div className="grid grid-cols-5 gap-1 mb-4">
                    {colorPalette.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-full h-8 rounded border-2 transition-all ${color === c ? 'border-emerald-400 shadow-glow' : 'border-slate-700/50'
                                }`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>

                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-wider">
                    Zoom: {zoom}x
                </h3>
                <input
                    type="range"
                    min="1"
                    max="16"
                    value={zoom}
                    onChange={(e) => setZoom(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 mb-4"
                />

                <div className="flex items-center justify-between mb-4">
                    <span className="terminal-text text-slate-400">Grid</span>
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs ${showGrid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/20 text-slate-400'
                            }`}
                    >
                        {showGrid ? 'ON' : 'OFF'}
                    </button>
                </div>

                <button
                    onClick={clearCanvas}
                    className="w-full px-3 py-2 rounded-lg font-mono text-xs bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30"
                >
                    Clear Canvas
                </button>
            </GlassCard>

            {/* Canvas */}
            <GlassCard className="flex-1">
                <div className="flex items-center justify-center p-4">
                    <div className="inline-block" style={{ imageRendering: 'pixelated' }}>
                        <canvas
                            ref={canvasRef}
                            width={width * zoom}
                            height={height * zoom}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="border-2 border-emerald-500/30 rounded cursor-crosshair"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                </div>
                <div className="text-center text-xs font-mono text-slate-500 mt-2">
                    {width}x{height} pixels @ {zoom}x zoom
                </div>
            </GlassCard>
        </div>
    );
};
