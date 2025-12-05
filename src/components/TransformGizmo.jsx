// Transform Controls Component
import React from 'react';
import { TransformControls as DreiTransformControls } from '@react-three/drei';

export function TransformGizmo({ mode, onDragEnd }) {
    if (!mode) return null;

    return (
        <DreiTransformControls
            mode={mode} // 'translate', 'rotate', or 'scale'
            onDragEnd={onDragEnd}
            size={0.75}
            showX={true}
            showY={true}
            showZ={true}
        />
    );
}
