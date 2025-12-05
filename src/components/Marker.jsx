// Marker component for 3D viewer
import React from 'react';
import { Html } from '@react-three/drei';

export function Marker({ position, type, instruction, id, onEdit, onDelete }) {
    const colors = {
        point: '#22d3ee',
        region: '#3b82f6',
        delete: '#ef4444',
        add: '#10b981',
        transform: '#f59e0b',
        material: '#8b5cf6'
    };

    return (
        <group position={position}>
            {/* 3D Marker Sphere */}
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                    color={colors[type]}
                    emissive={colors[type]}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Marker Label */}
            <Html distanceFactor={10}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: `2px solid ${colors[type]}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    minWidth: '150px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 20px ${colors[type]}40`
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        color: colors[type],
                        fontWeight: 'bold',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase'
                    }}>
                        {type} Marker
                    </div>
                    <div style={{
                        fontSize: '0.65rem',
                        color: '#fff',
                        marginBottom: '0.5rem'
                    }}>
                        {instruction}
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                            onClick={() => onEdit(id)}
                            style={{
                                flex: 1,
                                padding: '0.25rem',
                                background: 'rgba(34, 211, 238, 0.2)',
                                border: '1px solid #22d3ee',
                                borderRadius: '0.25rem',
                                color: '#22d3ee',
                                fontSize: '0.6rem',
                                cursor: 'pointer'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(id)}
                            style={{
                                flex: 1,
                                padding: '0.25rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid #ef4444',
                                borderRadius: '0.25rem',
                                color: '#ef4444',
                                fontSize: '0.6rem',
                                cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Html>
        </group>
    );
}
