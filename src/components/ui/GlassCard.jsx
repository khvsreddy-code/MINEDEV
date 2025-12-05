import React from 'react';

export const GlassCard = ({ children, className = '' }) => {
    return (
        <div className={`glass rounded-xl p-3 sm:p-4 ${className}`}>
            {children}
        </div>
    );
};
