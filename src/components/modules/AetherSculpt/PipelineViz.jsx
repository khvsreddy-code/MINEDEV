import React from 'react';

const steps = [
    { id: 1, name: 'Voxelize', status: 'completed' },
    { id: 2, name: 'Retopo', status: 'active' },
    { id: 3, name: 'UV Map', status: 'pending' },
    { id: 4, name: 'Export', status: 'pending' },
];

export const PipelineViz = ({ currentStep = 2 }) => {
    return (
        <div className="absolute top-4 left-0 right-0 mx-auto w-fit glass rounded-lg px-6 py-3">
            <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full transition-all duration-500 ${step.id < currentStep
                                        ? 'bg-emerald-500'
                                        : step.id === currentStep
                                            ? 'bg-emerald-400 animate-pulse shadow-glow'
                                            : 'bg-slate-700'
                                    }`}
                            />
                            <span
                                className={`text-xs font-mono uppercase tracking-wider ${step.id <= currentStep ? 'text-emerald-400' : 'text-slate-500'
                                    }`}
                            >
                                {step.name}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-8 h-0.5 bg-slate-700" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
