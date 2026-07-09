import React from 'react';
export const SkeletonCard = ({ className = '' }) => {
    return (<div className={`glass-panel animate-pulse bg-white/5 ${className}`}>
      <div className="h-full w-full bg-white/10 rounded-lg"></div>
    </div>);
};
