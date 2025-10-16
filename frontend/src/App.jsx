import React, { useEffect, useState } from 'react';
import { getMeta } from './api';
import Navigation from './components/Navigation';
import DateRangeSelector from './components/DateRangeSelector';
import OverviewPage from './pages/OverviewPage';
import SentimentPage from './pages/SentimentPage';
import AspectsPage from './pages/AspectsPage';
import AspectSentimentPage from './pages/AspectSentimentPage';
import ThemesPage from './pages/ThemesPage';
import RawDataPage from './pages/RawDataPage';

// Helper function
function iso(x) {
  if (!x) return '';
  const d = new Date(x);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [meta, setMeta] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load metadata once
  useEffect(() => {
    (async () => {
      try {
        const mr = await getMeta();
        setMeta(mr);
        setStart(mr?.min || '');
        setEnd(mr?.max || '');
      } catch (e) {
        setError('Failed to load metadata');
      }
    })();
  }, []);

  const handleStartChange = (value) => {
    setStart(iso(value));
  };

  const handleEndChange = (value) => {
    setEnd(iso(value));
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const renderActivePage = () => {
    const commonProps = {
      start,
      end,
      loading,
      error,
      onError: handleError,
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewPage {...commonProps} />;
      case 'sentiment':
        return <SentimentPage {...commonProps} />;
      case 'aspects':
        return <AspectsPage {...commonProps} />;
      case 'aspect-sentiment':
        return <AspectSentimentPage {...commonProps} />;
      case 'themes':
        return <ThemesPage {...commonProps} />;
      case 'raw-data':
        return <RawDataPage {...commonProps} />;
      default:
        return <OverviewPage {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DateRangeSelector
          start={start}
          end={end}
          minDate={meta?.min}
          maxDate={meta?.max}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          loading={loading}
        />
        
        {renderActivePage()}
      </main>
    </div>
  );
}
