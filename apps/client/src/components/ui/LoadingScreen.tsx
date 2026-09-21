// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Full Screen / Route Transition Loading Component
// =============================================================================

import React from "react";
import Spinner from "./Spinner";

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
