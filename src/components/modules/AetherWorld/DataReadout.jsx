import React from 'react';
import { GlassCard } from '../../ui/GlassCard';

export const DataReadout = ({ chunk }) => {
    if (!chunk || !chunk.loaded) {
        return (
            <GlassCard className="mt-6">
                <div className="text-center text-slate-500 font-mono text-sm py-8">
                    Select a loaded chunk to view data
                </div>
            </GlassCard>
        );
    }

    const data = {
        coords: { x: (chunk.id % 3) * 64, z: Math.floor(chunk.id / 3) * 64 },
        biome: chunk.biome,
        density: {
            trees: Math.random() * 100,
            rocks: Math.random() * 100,
            grass: Math.random() * 100,
        },
        navmesh: 'Generated',
        instances: Math.floor(Math.random() * 500) + 100,
    };

    return (
        <GlassCard className="mt-6">
            <h3 className="text-sm font-mono font-bold text-white mb-4 uppercase tracking-wider">
                Chunk Data Readout
            </h3>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto">
                {`{
  "chunk_id": ${chunk.id},
  "coordinates": {
    "x": ${data.coords.x},
    "z": ${data.coords.z}
  },
  "biome": "${data.biome}",
  "density_maps": {
    "trees": ${data.density.trees.toFixed(1)},
    "rocks": ${data.density.rocks.toFixed(1)},
    "grass": ${data.density.grass.toFixed(1)}
  },
  "navmesh_status": "${data.navmesh}",
  "instanced_objects": ${data.instances}
}`}
            </pre>
        </GlassCard>
    );
};
