import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';

const chunkData = [
    { id: 0, loaded: false, biome: null },
    { id: 1, loaded: true, biome: 'Forest' },
    { id: 2, loaded: false, biome: null },
    { id: 3, loaded: true, biome: 'Mountains' },
    { id: 4, loaded: true, biome: 'Plains', center: true },
    { id: 5, loaded: true, biome: 'Desert' },
    { id: 6, loaded: false, biome: null },
    { id: 7, loaded: true, biome: 'Ocean' },
    { id: 8, loaded: false, biome: null },
];

export const ChunkGrid = ({ onChunkSelect }) => {
    const [selectedChunk, setSelectedChunk] = useState(4);

    const handleChunkClick = (chunk) => {
        setSelectedChunk(chunk.id);
        onChunkSelect(chunk);
    };

    return (
        <div className="grid grid-cols-3 gap-3 w-fit mx-auto">
            {chunkData.map((chunk) => (
                <button
                    key={chunk.id}
                    onClick={() => handleChunkClick(chunk)}
                    className={`w-32 h-32 rounded-lg border-2 transition-all duration-300 ${chunk.loaded
                            ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30'
                            : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/70'
                        } ${selectedChunk === chunk.id
                            ? 'ring-2 ring-emerald-400 shadow-glow'
                            : ''
                        }`}
                >
                    {chunk.loaded && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                                {chunk.biome}
                            </div>
                            <div className="text-[9px] font-mono text-slate-500">
                                Chunk {chunk.id}
                            </div>
                            {chunk.center && (
                                <div className="mt-2 w-2 h-2 bg-emerald-500 rounded-full pulse-led" />
                            )}
                        </div>
                    )}
                    {!chunk.loaded && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-xs font-mono text-slate-600">UNLOADED</div>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};
