import React from 'react';

export const StatusLED = ({ status = 'active' }) => {
    const statusColors = {
        active: 'bg-emerald-500',
        idle: 'bg-slate-500',
        warning: 'bg-amber-500',
        error: 'bg-rose-500',
    };

    return (
        <div className={`w-2 h-2 rounded-full ${statusColors[status]} pulse-led`} />
    );
};
