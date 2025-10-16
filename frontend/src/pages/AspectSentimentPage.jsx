import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getAspectSentimentSplit } from '../api';

const AspectSentimentPage = ({ start, end, loading, error, onError }) => {
  const [split, setSplit] = useState(null);
  const [splitAsPercent, setSplitAsPercent] = useState(false);

  // Load aspect-sentiment data when dates change
  useEffect(() => {
    if (!start || !end) return;
    
    (async () => {
      try {
        onError(''); // Clear previous errors
        const data = await getAspectSentimentSplit(start, end, splitAsPercent);
        setSplit(data);
      } catch (e) {
        onError('Failed to load aspect-sentiment data. Is the API running on :8000?');
      }
    })();
  }, [start, end, splitAsPercent, onError]);

  // Chart data
  const stackedBarData = useMemo(() => {
    if (!split) return { labels: [], datasets: [] };
    const labels = split.labels || [];
    const series = splitAsPercent ? split.percent : split.counts;
    return {
      labels: labels.map((t) => t.toUpperCase()),
      datasets: [
        { 
          label: splitAsPercent ? '% Positive' : 'Positive', 
          data: series.positive || [], 
          backgroundColor: '#22c55e', 
          stack: 'sentiment',
          borderRadius: 4,
        },
        { 
          label: splitAsPercent ? '% Neutral' : 'Neutral', 
          data: series.neutral || [], 
          backgroundColor: '#facc15', 
          stack: 'sentiment',
          borderRadius: 4,
        },
        { 
          label: splitAsPercent ? '% Negative' : 'Negative', 
          data: series.negative || [], 
          backgroundColor: '#ef4444', 
          stack: 'sentiment',
          borderRadius: 4,
        },
      ],
    };
  }, [split, splitAsPercent]);

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      x: { 
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        suggestedMax: splitAsPercent ? 100 : undefined,
        ticks: { 
          callback: (v) => (splitAsPercent ? `${v}%` : v),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!split) return null;
    
    const labels = split.labels || [];
    const series = splitAsPercent ? split.percent : split.counts;
    
    let totalPositive = 0, totalNeutral = 0, totalNegative = 0;
    let aspectStats = {};
    
    labels.forEach((aspect, index) => {
      const positive = series.positive?.[index] || 0;
      const neutral = series.neutral?.[index] || 0;
      const negative = series.negative?.[index] || 0;
      
      totalPositive += positive;
      totalNeutral += neutral;
      totalNegative += negative;
      
      const total = positive + neutral + negative;
      aspectStats[aspect] = {
        total,
        positive,
        neutral,
        negative,
        positivePct: total > 0 ? (positive / total * 100).toFixed(1) : 0,
        negativePct: total > 0 ? (negative / total * 100).toFixed(1) : 0,
      };
    });
    
    return {
      totalPositive,
      totalNeutral,
      totalNegative,
      total: totalPositive + totalNeutral + totalNegative,
      aspectStats,
    };
  }, [split, splitAsPercent]);

  if (loading) {
    return <LoadingSpinner text="Loading aspect-sentiment analysis..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Aspect × Sentiment Analysis Controls</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={splitAsPercent}
              onChange={(e) => setSplitAsPercent(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show as percentage</span>
          </label>
        </div>
      </div>

      {/* KPI Cards */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Mentions"
            value={summaryStats.total.toLocaleString()}
            subtitle="Across all aspects"
            icon="📊"
            color="blue"
          />
          <KPICard
            title="Positive Mentions"
            value={splitAsPercent ? 
              `${((summaryStats.totalPositive / summaryStats.total) * 100).toFixed(1)}%` : 
              summaryStats.totalPositive.toLocaleString()
            }
            subtitle={splitAsPercent ? 'of all mentions' : 'total mentions'}
            icon="😊"
            color="green"
          />
          <KPICard
            title="Neutral Mentions"
            value={splitAsPercent ? 
              `${((summaryStats.totalNeutral / summaryStats.total) * 100).toFixed(1)}%` : 
              summaryStats.totalNeutral.toLocaleString()
            }
            subtitle={splitAsPercent ? 'of all mentions' : 'total mentions'}
            icon="😐"
            color="yellow"
          />
          <KPICard
            title="Negative Mentions"
            value={splitAsPercent ? 
              `${((summaryStats.totalNegative / summaryStats.total) * 100).toFixed(1)}%` : 
              summaryStats.totalNegative.toLocaleString()
            }
            subtitle={splitAsPercent ? 'of all mentions' : 'total mentions'}
            icon="😞"
            color="red"
          />
        </div>
      )}

      {/* Stacked Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Aspect × Sentiment Analysis {splitAsPercent ? '(Percentage)' : '(Count)'}
        </h2>
        <div className="h-96">
          <Bar data={stackedBarData} options={stackedBarOptions} />
        </div>
      </div>

      {/* Aspect Breakdown */}
      {summaryStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aspect Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(summaryStats.aspectStats).map(([aspect, stats]) => (
              <div key={aspect} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-center mb-3">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {aspect.replace('/', ' & ')}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">total mentions</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600">Positive</span>
                    <span className="text-xs font-medium text-green-600">
                      {stats.positivePct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${stats.positivePct}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-yellow-600">Neutral</span>
                    <span className="text-xs font-medium text-yellow-600">
                      {((stats.neutral / stats.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${((stats.neutral / stats.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-600">Negative</span>
                    <span className="text-xs font-medium text-red-600">
                      {stats.negativePct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${stats.negativePct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {summaryStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Most Positive Aspect</h3>
              {(() => {
                const mostPositive = Object.entries(summaryStats.aspectStats)
                  .sort((a, b) => parseFloat(b[1].positivePct) - parseFloat(a[1].positivePct))[0];
                return (
                  <div>
                    <div className="text-lg font-bold text-green-900 capitalize">
                      {mostPositive[0].replace('/', ' & ')}
                    </div>
                    <div className="text-sm text-green-700">
                      {mostPositive[1].positivePct}% positive sentiment
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Most Negative Aspect</h3>
              {(() => {
                const mostNegative = Object.entries(summaryStats.aspectStats)
                  .sort((a, b) => parseFloat(b[1].negativePct) - parseFloat(a[1].negativePct))[0];
                return (
                  <div>
                    <div className="text-lg font-bold text-red-900 capitalize">
                      {mostNegative[0].replace('/', ' & ')}
                    </div>
                    <div className="text-sm text-red-700">
                      {mostNegative[1].negativePct}% negative sentiment
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AspectSentimentPage;
