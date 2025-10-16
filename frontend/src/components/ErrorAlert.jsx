import React from 'react';

const ErrorAlert = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          <div className="mt-3 flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
