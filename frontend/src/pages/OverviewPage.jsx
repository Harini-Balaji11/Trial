import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getMeta, getSummary, getTrend } from '../api';

const OverviewPage = ({ start, end, loading, error, onError }) => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [meta, setMeta] = useState(null);

  // Load metadata once
  useEffect(() => {
    (async () => {
      try {
        const mr = await getMeta();
        setMeta(mr);
      } catch (e) {
        onError('Failed to load metadata');
      }
    })();
  }, [onError]);

  // Load summary and trend when dates change
  useEffect(() => {
    if (!start || !end) return;
    
    (async () => {
      try {
        onError(''); // Clear previous errors
        const [s, t] = await Promise.all([getSummary(start, end), getTrend(start, end)]);
        setSummary(s);
        setTrend(t?.trend || []);
      } catch (e) {
        onError('Failed to load data. Is the API running on :8000?');
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

  const total = summary?.total || 0;
  const pct = summary?.percent || {};

  if (loading) {
    return <LoadingSpinner text="Loading overview data..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Tweets"
          value={total.toLocaleString()}
          subtitle={`From ${start} to ${end}`}
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
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h2>
          <div className="h-80">
            <Bar data={sentimentBarData} options={chartOptions} />
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Sentiment Trend</h2>
          <div className="h-80">
            <Line data={trendLineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{pct.positive ?? 0}%</div>
            <div className="text-sm text-gray-600">Positive Sentiment</div>
            <div className="text-xs text-gray-500 mt-1">
              {pct.positive > 50 ? 'Above average positivity' : 'Below average positivity'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pct.neutral ?? 0}%</div>
            <div className="text-sm text-gray-600">Neutral Sentiment</div>
            <div className="text-xs text-gray-500 mt-1">
              {pct.neutral > 30 ? 'High neutral sentiment' : 'Low neutral sentiment'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{pct.negative ?? 0}%</div>
            <div className="text-sm text-gray-600">Negative Sentiment</div>
            <div className="text-xs text-gray-500 mt-1">
              {pct.negative > 30 ? 'High negative sentiment' : 'Low negative sentiment'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
