import React from 'react';
import './ProgressStep.css';

interface ProgressStepProps {
  steps: { icon: string; description: string }[];
  activeStep: number;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({ steps, activeStep }) => {
  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`progress-step ${index <= activeStep ? 'active' : ''}`}
        >
          <div className="icon">{step.icon}</div>
          <div className="description">{step.description}</div>
        </div>
      ))}
    </div>
  );
};

