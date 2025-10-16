import React from 'react';

const DateRangeSelector = ({ start, end, minDate, maxDate, onStartChange, onEndChange, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Date Range:</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={start || ''}
              min={minDate || ''}
              max={end || maxDate || ''}
              onChange={(e) => onStartChange(e.target.value)}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={end || ''}
              min={start || minDate || ''}
              max={maxDate || ''}
              onChange={(e) => onEndChange(e.target.value)}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sentiment API: 127.0.0.1:8000</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Themes API: localhost:3001</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
