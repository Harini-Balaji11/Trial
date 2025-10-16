import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const ThemesPage = ({ start, end, loading, error, onError }) => {
  const [themesPayload, setThemesPayload] = useState(null);
  const [themesLoading, setThemesLoading] = useState(true);
  const [themesErr, setThemesErr] = useState('');
  const [activeTheme, setActiveTheme] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [tweetsLoading, setTweetsLoading] = useState(false);
  const [tweetsErr, setTweetsErr] = useState('');

  // Load themes from Node backend
  useEffect(() => {
    setThemesLoading(true);
    setThemesErr('');
    fetch('http://localhost:3001/api/themes')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setThemesPayload(d))
      .catch((e) => setThemesErr(String(e)))
      .finally(() => setThemesLoading(false));
  }, []);

  // Load sample tweets for a theme
  const loadTweets = async (themeId) => {
    try {
      setActiveTheme(themeId);
      setTweetsLoading(true);
      setTweetsErr('');
      // Use direct URL to Node.js API since it's on a different port
      const r = await fetch(`http://localhost:3001/api/themes/${themeId}/tweets?limit=10`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setTweets(j.items || []);
    } catch (e) {
      setTweetsErr(String(e));
    } finally {
      setTweetsLoading(false);
    }
  };

  const cleanName = (name) => (name ? String(name).replace(/^"+|"+$/g, '').trim() : '');

  if (loading || themesLoading) {
    return <LoadingSpinner text="Loading themes and topics..." />;
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      {themesErr && <ErrorAlert message={`Themes API Error: ${themesErr}`} />}
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Themes & Topics Analysis</h2>
        <p className="text-gray-600">
          Unsupervised topic modeling results from your social media data. 
          Each theme represents a cluster of related conversations.
        </p>
        {themesPayload?.updated_at && (
          <div className="mt-2 text-sm text-gray-500">
            Last updated: {themesPayload.updated_at}
          </div>
        )}
      </div>

      {/* Themes Summary */}
      {themesPayload?.themes && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Themes"
            value={themesPayload.themes.length}
            subtitle="Discovered topics"
            icon="📚"
            color="blue"
          />
          <KPICard
            title="Total Tweets"
            value={themesPayload.themes.reduce((sum, theme) => sum + (theme.tweet_count || 0), 0).toLocaleString()}
            subtitle="Across all themes"
            icon="🐦"
            color="green"
          />
          <KPICard
            title="Avg Tweets/Theme"
            value={Math.round(themesPayload.themes.reduce((sum, theme) => sum + (theme.tweet_count || 0), 0) / themesPayload.themes.length).toLocaleString()}
            subtitle="Per theme"
            icon="📊"
            color="yellow"
          />
          <KPICard
            title="Largest Theme"
            value={Math.max(...themesPayload.themes.map(t => t.tweet_count || 0)).toLocaleString()}
            subtitle="Tweet count"
            icon="🎯"
            color="purple"
          />
        </div>
      )}

      {/* Themes List */}
      {themesPayload?.themes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovered Themes</h3>
          <div className="space-y-4">
            {themesPayload.themes.map((theme) => (
              <div key={theme.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {cleanName(theme.name) || `Theme ${theme.id}`}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {theme.tweet_count || 0} tweets
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Theme ID: {theme.id}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => loadTweets(theme.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Tweets
                  </button>
                </div>
                
                <div className="text-sm text-gray-700 leading-relaxed">
                  {theme.summary?.length > 300 ? 
                    `${theme.summary.slice(0, 300)}...` : 
                    (theme.summary || 'No summary available')
                  }
                </div>
                
                {theme.keywords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {theme.keywords.slice(0, 8).map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {theme.keywords.length > 8 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{theme.keywords.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tweet Drill-down */}
      {activeTheme !== null && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Theme {activeTheme} — Sample Tweets
            </h3>
            <button
              onClick={() => { setActiveTheme(null); setTweets([]); }}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
          
          {tweetsLoading && <LoadingSpinner text="Loading tweets..." />}
          {tweetsErr && <ErrorAlert message={`Tweets Error: ${tweetsErr}`} />}
          
          {!tweetsLoading && !tweetsErr && (
            <div className="space-y-4">
              {tweets.length > 0 ? (
                tweets.map((tweet, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{tweet.createdat || tweet.date || ''}</span>
                        {tweet.sentiment_label && (
                          <>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tweet.sentiment_label === 'positive' ? 'bg-green-100 text-green-800' :
                              tweet.sentiment_label === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tweet.sentiment_label}
                            </span>
                          </>
                        )}
                        {Number.isFinite(tweet.sentiment_score) && (
                          <>
                            <span>•</span>
                            <span>Score: {tweet.sentiment_score.toFixed(2)}</span>
                          </>
                        )}
                        {tweet.aspect_dominant && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {tweet.aspect_dominant}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-800 leading-relaxed mb-3">
                      {(tweet.text_clean || tweet.clean_tweet || tweet.text || '').slice(0, 280)}
                    </div>
                    
                    {tweet.twitterurl && (
                      <div>
                        <a 
                          href={tweet.twitterurl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Original Tweet →
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tweets found for this theme.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No themes message */}
      {!themesLoading && !themesErr && (!themesPayload?.themes || themesPayload.themes.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Themes Found</h3>
            <p className="text-gray-600">
              No themes have been generated yet. Make sure your topic modeling pipeline has been run.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemesPage;
