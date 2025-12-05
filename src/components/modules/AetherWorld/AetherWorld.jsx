import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ChunkGrid } from './ChunkGrid';
import { DataReadout } from './DataReadout';

export const AetherWorld = () => {
    const [selectedChunk, setSelectedChunk] = useState(null);

    return (
        <div className="w-full h-[calc(100vh-100px)] p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <GlassCard className="mb-6">
                    <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
                        AetherWorld
                    </h2>
                    <p className="text-sm font-mono text-slate-400">
                        Chunk-Based World Generation & Streaming (64x64m chunks)
                    </p>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-sm font-mono font-bold text-white mb-4 uppercase tracking-wider">
                        World Chunk Map
                    </h3>
                    <ChunkGrid onChunkSelect={setSelectedChunk} />
                    <DataReadout chunk={selectedChunk} />
                </GlassCard>
            </div>
        </div>
    );
};
