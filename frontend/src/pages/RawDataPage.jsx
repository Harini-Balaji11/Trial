import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const RawDataPage = ({ start, end, loading, error, onError }) => {
  const [rawData, setRawData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterAspect, setFilterAspect] = useState('all');

  // Mock data loading - in a real app, this would fetch from your API
  useEffect(() => {
    setDataLoading(true);
    setDataError('');
    
    // Simulate API call
    setTimeout(() => {
      // This is mock data - replace with actual API call
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: `Sample tweet ${i + 1} about Walmart shopping experience. This is a longer tweet that might contain various sentiments and aspects.`,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sentiment_label: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        sentiment_score: (Math.random() - 0.5) * 2,
        aspect_dominant: ['pricing', 'delivery', 'returns', 'staff', 'app/ux'][Math.floor(Math.random() * 5)],
        twitterurl: `https://twitter.com/user/status/${Math.random().toString(36).substr(2, 9)}`,
        user: `user${i + 1}`,
        retweets: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 500),
      }));
      
      setRawData(mockData);
      setDataLoading(false);
    }, 1000);
  }, [start, end]);

  // Filter and search data
  const filteredData = rawData.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || item.sentiment_label === filterSentiment;
    const matchesAspect = filterAspect === 'all' || item.aspect_dominant === filterAspect;
    
    return matchesSearch && matchesSentiment && matchesAspect;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Statistics
  const stats = {
    total: rawData.length,
    positive: rawData.filter(item => item.sentiment_label === 'positive').length,
    neutral: rawData.filter(item => item.sentiment_label === 'neutral').length,
    negative: rawData.filter(item => item.sentiment_label === 'negative').length,
    pricing: rawData.filter(item => item.aspect_dominant === 'pricing').length,
    delivery: rawData.filter(item => item.aspect_dominant === 'delivery').length,
    returns: rawData.filter(item => item.aspect_dominant === 'returns').length,
    staff: rawData.filter(item => item.aspect_dominant === 'staff').length,
    appUx: rawData.filter(item => item.aspect_dominant === 'app/ux').length,
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getAspectColor = (aspect) => {
    const colors = {
      'pricing': 'bg-blue-100 text-blue-800',
      'delivery': 'bg-green-100 text-green-800',
      'returns': 'bg-yellow-100 text-yellow-800',
      'staff': 'bg-purple-100 text-purple-800',
      'app/ux': 'bg-red-100 text-red-800',
    };
    return colors[aspect] || 'bg-gray-100 text-gray-800';
  };

  if (loading || dataLoading) {
    return <LoadingSpinner text="Loading raw data..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      {dataError && <ErrorAlert message={dataError} />}
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔍 Raw Data Explorer</h2>
        <p className="text-gray-600">
          Browse individual tweets and explore the raw data from your sentiment analysis pipeline.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Total Tweets"
          value={stats.total.toLocaleString()}
          subtitle="In dataset"
          icon="📊"
          color="blue"
        />
        <KPICard
          title="Positive"
          value={stats.positive.toLocaleString()}
          subtitle={`${((stats.positive / stats.total) * 100).toFixed(1)}%`}
          icon="😊"
          color="green"
        />
        <KPICard
          title="Neutral"
          value={stats.neutral.toLocaleString()}
          subtitle={`${((stats.neutral / stats.total) * 100).toFixed(1)}%`}
          icon="😐"
          color="yellow"
        />
        <KPICard
          title="Negative"
          value={stats.negative.toLocaleString()}
          subtitle={`${((stats.negative / stats.total) * 100).toFixed(1)}%`}
          icon="😞"
          color="red"
        />
        <KPICard
          title="Filtered Results"
          value={filteredData.length.toLocaleString()}
          subtitle="After filters"
          icon="🔍"
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Text</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in tweet text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aspect</label>
            <select
              value={filterAspect}
              onChange={(e) => setFilterAspect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Aspects</option>
              <option value="pricing">Pricing</option>
              <option value="delivery">Delivery</option>
              <option value="returns">Returns</option>
              <option value="staff">Staff</option>
              <option value="app/ux">App/UX</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSentiment('all');
                setFilterAspect('all');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Tweets ({filteredData.length} results)
          </h3>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="space-y-4">
          {currentData.map((tweet) => (
            <div key={tweet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    #{tweet.id} • {tweet.created_at}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(tweet.sentiment_label)}`}>
                    {tweet.sentiment_label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAspectColor(tweet.aspect_dominant)}`}>
                    {tweet.aspect_dominant}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>❤️ {tweet.likes}</span>
                  <span>🔄 {tweet.retweets}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-800 leading-relaxed mb-3">
                {tweet.text}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  @{tweet.user} • Score: {tweet.sentiment_score?.toFixed(2)}
                </div>
                <a
                  href={tweet.twitterurl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Tweet →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RawDataPage;
