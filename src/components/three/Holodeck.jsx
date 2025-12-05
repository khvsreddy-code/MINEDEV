import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Scene3D = () => {
    const meshRef = useRef();

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#10b981" />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a855f7" />

            {/* Holodeck Grid */}
            <Grid
                args={[40, 40]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#10b981"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#34d399"
                fadeDistance={30}
                fadeStrength={1}
                followCamera={false}
                position={[0, -2, 0]}
                rotation={[0, 0, 0]}
                infiniteGrid
            />

            {/* Example 3D Object */}
            <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <meshStandardMaterial
                    color="#10b981"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#10b981"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Camera Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={20}
            />

            {/* Environment */}
            <Environment preset="night" />
        </>
    );
};

export const Holodeck = () => {
    return (
        <div className="w-full h-full relative bg-black/50 rounded-lg overflow-hidden border border-emerald-500/20">
            <Canvas
                camera={{ position: [5, 3, 5], fov: 50 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <Scene3D />
            </Canvas>
        </div>
    );
};
