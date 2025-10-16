# Walmart Social Listener - Interactive Dashboard

A modern, interactive web dashboard for analyzing Walmart social media sentiment data with comprehensive visualization and analysis tools.

## Features

### 🎯 **Tabbed Navigation Interface**
- **Overview**: Dashboard summary with KPIs and key metrics
- **Sentiment Analysis**: Detailed sentiment trends and distribution
- **Aspect Analysis**: Topic-based sentiment breakdown (pricing, delivery, returns, staff, app/ux)
- **Aspect × Sentiment**: Combined analysis showing sentiment by topic
- **Themes & Topics**: Unsupervised topic modeling results with drill-down capabilities
- **Raw Data Explorer**: Browse individual tweets with filtering and search

### 📊 **Interactive Visualizations**
- **Bar Charts**: Sentiment distribution, aspect analysis
- **Line Charts**: Daily sentiment trends over time
- **Doughnut Charts**: Percentage-based sentiment breakdowns
- **Stacked Bar Charts**: Aspect-sentiment combinations
- **Progress Bars**: Visual sentiment breakdowns by aspect

### 🔧 **Advanced Features**
- **Date Range Filtering**: Analyze specific time periods
- **Real-time API Integration**: Connects to FastAPI backend (port 8000) and Node.js themes API (port 3001)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with retry options
- **Loading States**: Smooth loading indicators throughout the app
- **Search & Filter**: Advanced filtering in raw data explorer

## Technology Stack

- **Frontend**: React 19.1.1 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Python backend running on port 8000
- Node.js themes API running on port 3001

### Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

### API Endpoints

The frontend expects the following APIs to be running:

- **Sentiment API** (FastAPI): `http://127.0.0.1:8000`
  - `/sentiment/summary` - Get sentiment summary for date range
  - `/sentiment/trend` - Get daily sentiment trends
  - `/aspects/summary` - Get aspect distribution
  - `/aspects/sentiment-split` - Get aspect-sentiment combinations

- **Themes API** (Node.js): `http://localhost:3001`
  - `/api/themes` - Get list of discovered themes
  - `/api/themes/:id/tweets` - Get sample tweets for a theme

## Project Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   ├── DateRangeSelector.jsx
│   ├── KPICard.jsx     # Key performance indicator cards
│   ├── LoadingSpinner.jsx
│   └── ErrorAlert.jsx
├── pages/               # Individual analysis pages
│   ├── OverviewPage.jsx
│   ├── SentimentPage.jsx
│   ├── AspectsPage.jsx
│   ├── AspectSentimentPage.jsx
│   ├── ThemesPage.jsx
│   └── RawDataPage.jsx
├── api.js              # API client functions
├── App.jsx             # Main application component
├── App.css             # Global styles
├── index.css           # Tailwind CSS imports
└── main.jsx            # Application entry point
```

## Usage

### 1. **Overview Tab**
- View high-level KPIs and metrics
- See sentiment distribution and daily trends
- Get quick insights into overall performance

### 2. **Sentiment Analysis Tab**
- Detailed sentiment breakdown with multiple chart types
- Daily trend analysis with interactive line charts
- Sentiment insights and recommendations

### 3. **Aspect Analysis Tab**
- Topic-based analysis (pricing, delivery, returns, staff, app/ux)
- Toggle between count and percentage views
- Aspect distribution with detailed statistics

### 4. **Aspect × Sentiment Tab**
- Combined analysis showing sentiment by topic
- Stacked bar charts for easy comparison
- Key insights highlighting most positive/negative aspects

### 5. **Themes & Topics Tab**
- Unsupervised topic modeling results
- Drill-down capability to view sample tweets
- Theme summaries and keyword extraction

### 6. **Raw Data Explorer Tab**
- Browse individual tweets with pagination
- Advanced filtering by sentiment, aspect, and text search
- Direct links to original tweets

## Customization

### Adding New Analysis Types
1. Create a new page component in `src/pages/`
2. Add the tab to the navigation in `src/components/Navigation.jsx`
3. Update the routing logic in `src/App.jsx`

### Styling
- Uses Tailwind CSS for consistent styling
- Custom colors and themes can be modified in `tailwind.config.js`
- Component-specific styles are co-located with components

### API Integration
- API functions are centralized in `src/api.js`
- Easy to add new endpoints or modify existing ones
- Error handling is built into the API client

## Performance

- **Lazy Loading**: Components are loaded only when needed
- **Memoization**: Chart data is memoized to prevent unnecessary re-renders
- **Responsive Images**: Optimized for different screen sizes
- **Efficient State Management**: Minimal re-renders with proper state structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code structure and naming conventions
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure responsive design for all screen sizes

## License

This project is part of the Walmart Social Listener system.