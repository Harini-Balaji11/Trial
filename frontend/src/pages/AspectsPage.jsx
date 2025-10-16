import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getAspectSummary, getAspectAvgScores } from '../api';

const AspectsPage = ({ start, end, loading, error, onError }) => {
  const [aspectSummary, setAspectSummary] = useState(null);
  const [avgScores, setAvgScores] = useState(null);
  const [asPercent, setAsPercent] = useState(false);

  // Load aspect data when dates change
  useEffect(() => {
    if (!start || !end) return;
    
    (async () => {
      try {
        onError(''); // Clear previous errors
        const [summary, scores] = await Promise.all([
          getAspectSummary(start, end, asPercent),
          getAspectAvgScores(start, end)
        ]);
        setAspectSummary(summary);
        setAvgScores(scores);
      } catch (e) {
        onError('Failed to load aspect data. Is the API running on :8000?');
      }
    })();
  }, [start, end, asPercent, onError]);

  // Chart data
  const aspectBarData = useMemo(() => {
    if (!aspectSummary) return { labels: [], datasets: [] };
    const labels = aspectSummary.labels || ['pricing', 'delivery', 'returns', 'staff', 'app/ux'];
    const seriesObj = aspectSummary.series || aspectSummary.counts || {};
    const values = labels.map((l) => seriesObj[l] ?? 0);
    return {
      labels: labels.map((t) => t.toUpperCase()),
      datasets: [
        {
          label: asPercent ? 'Aspect Share (%)' : 'Aspect Count',
          data: values,
          backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444'],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [aspectSummary, asPercent]);

  const aspectDoughnutData = useMemo(() => {
    if (!aspectSummary) return { labels: [], datasets: [] };
    const labels = aspectSummary.labels || ['pricing', 'delivery', 'returns', 'staff', 'app/ux'];
    const seriesObj = aspectSummary.series || aspectSummary.counts || {};
    const values = labels.map((l) => seriesObj[l] ?? 0);
    return {
      labels: labels.map((t) => t.toUpperCase()),
      datasets: [
        {
          data: values,
          backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [aspectSummary]);

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
        ticks: {
          callback: (value) => asPercent ? `${value}%` : value,
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

  const total = aspectSummary?.total || 0;
  const counts = aspectSummary?.counts || {};
  const percent = aspectSummary?.percent || {};

  if (loading) {
    return <LoadingSpinner text="Loading aspect analysis..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Aspect Analysis Controls</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={asPercent}
              onChange={(e) => setAsPercent(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show as percentage</span>
          </label>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Total Tweets"
          value={total.toLocaleString()}
          subtitle="With aspect analysis"
          icon="📊"
          color="blue"
        />
        <KPICard
          title="Pricing"
          value={asPercent ? `${percent.pricing || 0}%` : (counts.pricing || 0).toLocaleString()}
          subtitle={asPercent ? 'of all aspects' : 'mentions'}
          icon="💰"
          color="blue"
        />
        <KPICard
          title="Delivery"
          value={asPercent ? `${percent.delivery || 0}%` : (counts.delivery || 0).toLocaleString()}
          subtitle={asPercent ? 'of all aspects' : 'mentions'}
          icon="🚚"
          color="green"
        />
        <KPICard
          title="Returns"
          value={asPercent ? `${percent.returns || 0}%` : (counts.returns || 0).toLocaleString()}
          subtitle={asPercent ? 'of all aspects' : 'mentions'}
          icon="↩️"
          color="yellow"
        />
        <KPICard
          title="Staff"
          value={asPercent ? `${percent.staff || 0}%` : (counts.staff || 0).toLocaleString()}
          subtitle={asPercent ? 'of all aspects' : 'mentions'}
          icon="👥"
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aspect Distribution Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Aspect Distribution {asPercent ? '(Percentage)' : '(Count)'}
          </h2>
          <div className="h-80">
            <Bar data={aspectBarData} options={chartOptions} />
          </div>
        </div>

        {/* Aspect Distribution Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aspect Distribution (Pie)</h2>
          <div className="h-80">
            <Doughnut data={aspectDoughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Aspect Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aspect Analysis Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {['pricing', 'delivery', 'returns', 'staff', 'app/ux'].map((aspect) => {
            const count = counts[aspect] || 0;
            const pct = percent[aspect] || 0;
            const avgScore = avgScores?.avg_scores?.[`aspect_${aspect}`] || 0;
            
            return (
              <div key={aspect} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {asPercent ? `${pct}%` : count.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {aspect.replace('/', ' & ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Avg Score: {avgScore.toFixed(2)}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {asPercent ? 'of all aspects' : 'mentions'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aspect Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aspect Insights</h2>
        <div className="space-y-4">
          {Object.entries(counts).map(([aspect, count]) => {
            const pct = percent[aspect] || 0;
            const isTopAspect = pct === Math.max(...Object.values(percent));
            
            return (
              <div key={aspect} className={`p-4 rounded-lg border-l-4 ${
                isTopAspect ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {aspect.replace('/', ' & ')} {isTopAspect && '⭐'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {count.toLocaleString()} mentions ({pct}% of all aspects)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{pct}%</div>
                    <div className="text-xs text-gray-500">share</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AspectsPage;
