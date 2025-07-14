# API Caching Optimization Plan

## Problem Analysis

### Current Issues Identified
Based on the proxy logs, we have severe performance issues:

1. **Massive Duplicate Calls**: Same API endpoints called multiple times within seconds
   - `GET /api/businesses?category=lawyers&city=sacramento` - called 3+ times
   - `GET /api/cities` - called 10+ times  
   - `GET /api/businesses-by-category?category=water-refill` - called 8+ times

2. **No Caching Strategy**: Every component re-fetches the same data
3. **Inefficient Data Loading**: Components don't share cached results
4. **Resource Waste**: Unnecessary database queries and network overhead

### Root Causes
- Components making individual API calls without coordination
- No client-side caching mechanism
- Possible React re-renders triggering repeated data fetches
- Missing request deduplication
- No cache invalidation strategy

## Proposed Solution Architecture

### 1. Multi-Layer Caching Strategy

#### **Layer 1: In-Memory Cache (Client-Side)**
```
┌─────────────────────────────────────┐
│           React Query Cache         │
│  ┌─────────────┐ ┌─────────────────┐│
│  │ businesses  │ │     cities      ││
│  │ categories  │ │   water-refill  ││
│  └─────────────┘ └─────────────────┘│
└─────────────────────────────────────┘
```

#### **Layer 2: Session Storage (Browser)**
- Persist data across page refreshes
- Reduce API calls for common data (cities, categories)

#### **Layer 3: API Response Caching (Server-Side)**
- Cache frequently requested data
- Implement ETags for conditional requests

### 2. Implementation Plan

#### **Phase 1: React Query Integration**
```typescript
// New Cache Manager
src/
├── hooks/
│   ├── useBusinesses.ts     // Cached business queries
│   ├── useCities.ts        // Cached cities data
│   └── useCategories.ts    // Cached categories
├── lib/
│   ├── queryClient.ts      // React Query configuration
│   └── cacheKeys.ts        // Centralized cache keys
└── providers/
    └── QueryProvider.tsx   // App-level query provider
```

#### **Phase 2: Request Deduplication**
- Implement request batching for similar queries
- Add request merging for concurrent identical requests
- Create intelligent prefetching strategies

#### **Phase 3: Cache Invalidation Strategy**
- Time-based expiration (5-15 minutes for business data)
- Manual invalidation for real-time updates
- Background refresh for stale data

### 3. Specific Optimizations

#### **A. Business Data Caching**
```typescript
// Current Problem:
GET /api/businesses?category=lawyers&city=sacramento (called 3x)
GET /api/businesses?category=lawyers&city=san-diego (called 2x)

// Solution: Smart caching with query keys
useBusinesses({ category: 'lawyers', city: 'sacramento' })
// → Cache key: ['businesses', 'lawyers', 'sacramento']
// → TTL: 10 minutes
// → Stale time: 5 minutes
```

#### **B. Cities Data Optimization**
```typescript
// Current Problem:
GET /api/cities (called 10+ times)

// Solution: App-level caching
useCities()
// → Cache key: ['cities']
// → TTL: 30 minutes (cities rarely change)
// → Prefetch on app load
```

#### **C. Category-Based Caching**
```typescript
// Current Problem:
GET /api/businesses-by-category?category=water-refill (called 8x)

// Solution: Category-specific caching
useBusinessesByCategory('water-refill')
// → Cache key: ['businesses-by-category', 'water-refill']
// → TTL: 15 minutes
// → Background refetch
```

### 4. Performance Metrics & Goals

#### **Current State (Estimated)**
- 200+ duplicate API calls per page load
- ~5-10 second load times
- High server load
- Poor user experience

#### **Target State**
- 90% reduction in API calls
- ~1-2 second load times  
- Minimal server impact
- Smooth user experience

### 5. Implementation Steps

#### **Step 1: Setup React Query**
1. Install `@tanstack/react-query`
2. Create QueryClient configuration
3. Wrap app with QueryProvider
4. Add React Query DevTools

#### **Step 2: Migrate Data Fetching Hooks**
1. Convert existing fetch calls to React Query
2. Implement proper cache keys
3. Add error handling and retry logic
4. Set appropriate stale/cache times

#### **Step 3: Optimize Query Patterns**
1. Implement prefetching for predictable data
2. Add background refetching for stale data
3. Create dependent queries for related data
4. Add optimistic updates where appropriate

#### **Step 4: Advanced Optimizations**
1. Request batching for multiple queries
2. Infinite queries for paginated data
3. Selective re-fetching based on data freshness
4. Smart prefetching based on user behavior

### 6. Cache Configuration Strategy

#### **Data Categories & TTL**
```typescript
const CACHE_CONFIG = {
  cities: {
    staleTime: 30 * 60 * 1000,     // 30 minutes
    cacheTime: 60 * 60 * 1000,     // 1 hour
    refetchOnWindowFocus: false
  },
  businesses: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    cacheTime: 15 * 60 * 1000,     // 15 minutes
    refetchOnWindowFocus: true
  },
  categories: {
    staleTime: 60 * 60 * 1000,     // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false
  }
}
```

### 7. Migration Strategy

#### **Backwards Compatibility**
- Gradual migration of existing hooks
- Keep current API structure
- Maintain existing component interfaces
- Progressive enhancement approach

#### **Testing Strategy**
- Monitor cache hit/miss ratios
- Track API call reduction metrics
- Measure page load performance
- User experience testing

### 8. Expected Outcomes

#### **Performance Improvements**
- **90% reduction** in duplicate API calls
- **70% faster** page load times
- **Improved UX** with instant cached responses
- **Reduced server load** and costs

#### **Developer Experience**
- Simplified data fetching patterns
- Built-in loading/error states
- Automatic background updates
- DevTools for cache debugging

### 9. Risks & Mitigation

#### **Potential Risks**
- Stale data serving to users
- Memory usage from caching
- Complex cache invalidation logic
- Learning curve for team

#### **Mitigation Strategies**
- Conservative cache times initially
- Background refresh for critical data
- Memory usage monitoring
- Comprehensive documentation

### 10. Success Metrics

#### **Technical Metrics**
- API call reduction: Target 90%
- Cache hit ratio: Target 80%+
- Page load time: Target <2 seconds
- Memory usage: Monitor and optimize

#### **Business Metrics**
- User engagement improvement
- Reduced bounce rate
- Better SEO performance
- Lower infrastructure costs

---

## Next Steps

1. **Review this plan** and provide feedback
2. **Approve implementation** approach
3. **Begin Phase 1** with React Query setup
4. **Monitor and iterate** based on results

Would you like me to proceed with this implementation plan?
