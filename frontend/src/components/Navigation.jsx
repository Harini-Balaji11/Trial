import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: '📊 Overview', description: 'Dashboard summary and KPIs' },
    { id: 'sentiment', label: '😊 Sentiment Analysis', description: 'Overall sentiment trends and distribution' },
    { id: 'aspects', label: '🎯 Aspect Analysis', description: 'Topic-based sentiment breakdown' },
    { id: 'aspect-sentiment', label: '📈 Aspect × Sentiment', description: 'Combined analysis by topic and sentiment' },
    { id: 'themes', label: '📚 Themes & Topics', description: 'Unsupervised topic modeling results' },
    { id: 'raw-data', label: '🔍 Raw Data Explorer', description: 'Browse individual tweets and data' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🧠 Walmart Social Listener
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  title={tab.description}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
