import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getSummary, getTrend } from '../api';

const SentimentPage = ({ start, end, loading, error, onError }) => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);

  // Load sentiment data when dates change
  useEffect(() => {
    if (!start || !end) return;
    
    (async () => {
      try {
        onError(''); // Clear previous errors
        const [s, t] = await Promise.all([getSummary(start, end), getTrend(start, end)]);
        setSummary(s);
        setTrend(t?.trend || []);
      } catch (e) {
        onError('Failed to load sentiment data. Is the API running on :8000?');
      }
    })();
  }, [start, end, onError]);

  // Chart data
  const sentimentBarData = useMemo(() => {
    const counts = summary?.counts || {};
    const labels = ['positive', 'neutral', 'negative'];
    const values = labels.map((k) => counts[k] || 0);
    return {
      labels: labels.map((s) => s[0].toUpperCase() + s.slice(1)),
      datasets: [
        {
          label: 'Tweet Count',
          data: values,
          backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [summary]);

  const sentimentDoughnutData = useMemo(() => {
    const counts = summary?.counts || {};
    const labels = ['positive', 'neutral', 'negative'];
    const values = labels.map((k) => counts[k] || 0);
    return {
      labels: labels.map((s) => s[0].toUpperCase() + s.slice(1)),
      datasets: [
        {
          data: values,
          backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [summary]);

  const trendLineData = useMemo(() => {
    const labels = trend.map((r) => r.date);
    const pos = trend.map((r) => r.positive ?? 0);
    const neu = trend.map((r) => r.neutral ?? 0);
    const neg = trend.map((r) => r.negative ?? 0);
    return {
      labels,
      datasets: [
        { 
          label: '% Positive', 
          data: pos, 
          borderColor: '#22c55e', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        { 
          label: '% Neutral', 
          data: neu, 
          borderColor: '#facc15', 
          backgroundColor: 'rgba(250, 204, 21, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        { 
          label: '% Negative', 
          data: neg, 
          borderColor: '#ef4444', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [trend]);

  const chartOptions = {
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
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  const total = summary?.total || 0;
  const pct = summary?.percent || {};

  if (loading) {
    return <LoadingSpinner text="Loading sentiment analysis..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Tweets Analyzed"
          value={total.toLocaleString()}
          subtitle="Sentiment classified"
          icon="📊"
          color="blue"
        />
        <KPICard
          title="Positive Sentiment"
          value={`${pct.positive ?? 0}%`}
          subtitle={`${summary?.counts?.positive || 0} tweets`}
          icon="😊"
          color="green"
        />
        <KPICard
          title="Neutral Sentiment"
          value={`${pct.neutral ?? 0}%`}
          subtitle={`${summary?.counts?.neutral || 0} tweets`}
          icon="😐"
          color="yellow"
        />
        <KPICard
          title="Negative Sentiment"
          value={`${pct.negative ?? 0}%`}
          subtitle={`${summary?.counts?.negative || 0} tweets`}
          icon="😞"
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution (Count)</h2>
          <div className="h-80">
            <Bar data={sentimentBarData} options={chartOptions} />
          </div>
        </div>

        {/* Sentiment Distribution Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution (Percentage)</h2>
          <div className="h-80">
            <Doughnut data={sentimentDoughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Sentiment Trend</h2>
        <div className="h-96">
          <Line data={trendLineData} options={chartOptions} />
        </div>
      </div>

      {/* Sentiment Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{pct.positive ?? 0}%</div>
            <div className="text-sm font-medium text-green-800 mb-1">Positive Sentiment</div>
            <div className="text-xs text-green-600">
              {pct.positive > 50 ? 'Above average positivity - customers are generally satisfied' : 
               pct.positive > 30 ? 'Moderate positivity - mixed customer sentiment' : 
               'Below average positivity - customers may have concerns'}
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{pct.neutral ?? 0}%</div>
            <div className="text-sm font-medium text-yellow-800 mb-1">Neutral Sentiment</div>
            <div className="text-xs text-yellow-600">
              {pct.neutral > 40 ? 'High neutral sentiment - many customers are indifferent' : 
               pct.neutral > 20 ? 'Moderate neutral sentiment - balanced customer views' : 
               'Low neutral sentiment - customers have strong opinions'}
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">{pct.negative ?? 0}%</div>
            <div className="text-sm font-medium text-red-800 mb-1">Negative Sentiment</div>
            <div className="text-xs text-red-600">
              {pct.negative > 30 ? 'High negative sentiment - customers have significant concerns' : 
               pct.negative > 15 ? 'Moderate negative sentiment - some customer dissatisfaction' : 
               'Low negative sentiment - customers are generally satisfied'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentPage;
