# HomePage Data Context Provider

## Overview

The `HomePageDataProvider` is a React context provider that handles all data fetching and processing for the HomePage component. This approach provides several benefits:

- **Performance**: Data is fetched once and shared across components
- **Separation of Concerns**: HomePage is now purely presentational
- **Centralized Loading**: Single loading state for all homepage data
- **Error Handling**: Centralized error handling with timeout support

## Architecture

```
App Level
├── HomePageDataProvider (wraps routes that need homepage data)
│   ├── Fetches all categories and cities
│   ├── Aggregates business data
│   ├── Processes service categories
│   ├── Processes city data
│   └── Provides: { services, cities, loading, error }
└── HomePage (consumes data via useHomePageData hook)
    ├── Pure presentation component
    ├── Search filtering
    └── URL generation
```

## Usage

### 1. Wrap your app/routes with the provider:

```tsx
import { HomePageDataProvider } from '@/providers/HomePageDataProvider';

function App() {
  return (
    <HomePageDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage subdomainInfo={subdomainInfo} />} />
          {/* other routes */}
        </Routes>
      </Router>
    </HomePageDataProvider>
  );
}
```

### 2. Use the hook in components:

```tsx
import { useHomePageData } from '@/providers/HomePageDataProvider';

function HomePage() {
  const { services, cities, loading, error } = useHomePageData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
```

## Data Structure

### ServiceCategory
```tsx
interface ServiceCategory {
  name: string;        // "Nail Salons"
  slug: string;        // "nail-salons"
  count: number;       // 42
  description: string; // "Find the best nail salons near you"
  icon: string;        // "🏪"
}
```

### CityData
```tsx
interface CityData {
  name: string;   // "Dallas"
  slug: string;   // "dallas"
  state: string;  // "TX"
  count: number;  // 156
}
```

## Benefits

1. **Single Data Fetch**: All homepage data is fetched once when the provider mounts
2. **Shared State**: Multiple components can access the same data without refetching
3. **Optimized Performance**: No N+1 query problems in individual components
4. **Error Boundaries**: Centralized error handling with graceful fallbacks
5. **Loading States**: Single loading state for better UX
6. **Timeout Handling**: 10-second timeout prevents hanging requests

## Migration from Direct DataProvider Usage

**Before:**
```tsx
const HomePage = ({ subdomainInfo }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = DataProviderFactory.getProvider();
  
  useEffect(() => {
    // Complex data fetching logic
    loadData();
  }, []);
  
  // ... rest of component
};
```

**After:**
```tsx
const HomePage = ({ subdomainInfo }) => {
  const { services, cities, loading, error } = useHomePageData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pure presentation logic only
  // ... rest of component
};
```

## Error Handling

The provider includes comprehensive error handling:

- **Network Errors**: Graceful fallback to empty arrays
- **Timeout Protection**: 10-second timeout prevents hanging
- **Per-Request Errors**: Individual city/category failures don't break the entire load
- **User-Friendly Messages**: Clear error states for users

## Performance Considerations

- **Initial Load**: Fetches all data upfront (one-time cost)
- **Memory Usage**: Keeps all service/city data in memory
- **Re-renders**: Context updates trigger re-renders in consuming components
- **Caching**: Consider adding React Query or SWR for additional caching layers

## Future Enhancements

1. **Background Refresh**: Periodic data updates
2. **Incremental Loading**: Load categories first, then cities
3. **Caching Layer**: Add React Query for server state management
4. **Optimistic Updates**: Local state updates before server confirmation
