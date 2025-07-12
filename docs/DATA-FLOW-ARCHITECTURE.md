# Data Flow Architecture Guide

This document explains how data flows through the Near Me application from the frontend to the database.

## Overview

The Near Me application uses a clean, three-layer architecture:

```
Frontend (React) → D1DataProvider → API Endpoints → D1 Database
```

## Complete Data Flow Example

Let's trace how getting cities works from start to finish:

### 1. Frontend Component Makes Request
```typescript
// In a React component
const dataProvider = new D1DataProvider();
const cities = await dataProvider.getCities();
```

### 2. D1DataProvider Method Called
```typescript
// src/providers/D1DataProvider.ts
async getCities(): Promise<string[]> {
  try {
    const cities = await this.apiRequest<Array<{ name: string }>>(ApiEndpoints.CITIES);
    return cities.map(city => city.name);
  } catch (error) {
    console.error('Failed to get cities:', error);
    return [];
  }
}
```

### 3. Endpoint Resolved
```typescript
// src/config/endpoints.ts
export enum ApiEndpoints {
  CITIES = '/api/cities',
  // ... other endpoints
}
```

### 4. HTTP Request Made
```typescript
// Inside D1DataProvider.apiRequest()
private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${this.apiBaseUrl}${endpoint}`;
  // url becomes: "https://your-domain.com/api/cities"
  
  const response = await fetch(url, {
    headers: this.defaultHeaders,
    ...options,
  });
  
  return await response.json();
}
```

### 5. Cloudflare Routes to Function
```
URL: https://your-domain.com/api/cities
Routes to: functions/api/cities.ts
```

### 6. Function Queries Database
```typescript
// functions/api/cities.ts
export async function onRequestGet({ env, request }: { env: Env; request: Request }) {
  const url = new URL(request.url);
  const includeState = url.searchParams.has('include_state');

  let query: string;
  if (includeState) {
    query = 'SELECT name, state FROM cities WHERE state IS NOT NULL ORDER BY name ASC';
  } else {
    query = 'SELECT name FROM cities ORDER BY display_name ASC';
  }

  const result = await env.DB.prepare(query).all();
  
  return new Response(JSON.stringify(result.results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 7. Data Returns Through Chain
```
Database → Function → HTTP Response → apiRequest → getCities() → React Component
```

## Key Components

### D1DataProvider (`src/providers/D1DataProvider.ts`)
- **Role**: HTTP client wrapper
- **Responsibility**: Makes API requests, handles errors, formats responses
- **Does NOT**: Access database directly
- **Key Method**: `apiRequest()` - generic HTTP request handler

### ApiEndpoints (`src/config/endpoints.ts`)
- **Role**: Centralized endpoint definitions
- **Provides**: Type-safe endpoint strings
- **Benefits**: Single source of truth, prevents typos, easy refactoring

### EndpointBuilder (`src/config/endpoints.ts`)
- **Role**: Dynamic endpoint construction
- **Examples**:
  - `waterStationById('123')` → `'/api/water-stations/123'`
  - `businessesWithParams('nail-salons', 'san-francisco')` → `'/api/businesses?category=nail-salons&city=san-francisco'`

### Functions API (`functions/api/*.ts`)
- **Role**: Server-side API handlers
- **Responsibility**: Process HTTP requests, query database, return JSON
- **Has Access To**: D1 Database via `env.DB`

## Routing Examples

| Method Call | Endpoint Used | Full URL | Routes To | Database Query |
|-------------|---------------|----------|-----------|----------------|
| `getCities()` | `ApiEndpoints.CITIES` | `/api/cities` | `functions/api/cities.ts` | `SELECT name FROM cities...` |
| `getWaterStationById('123')` | `EndpointBuilder.waterStationById('123')` | `/api/water-stations/123` | `functions/api/water-stations/[stationId].ts` | `SELECT * FROM businesses WHERE id = ?...` |
| `submitContact(data)` | `ApiEndpoints.CONTACT` | `/api/contact` | `functions/api/contact.ts` | `INSERT INTO contact_messages...` |
| `getBusinesses('nail-salons', 'sf')` | `EndpointBuilder.businessesWithParams(...)` | `/api/businesses?category=nail-salons&city=sf` | `functions/api/businesses.ts` | `SELECT * FROM businesses WHERE...` |

## Water Stations Example (Complete Flow)

### Frontend Request
```typescript
const station = await dataProvider.getWaterStationById('2b32f46c-73ff-426a-ac8b-96693cf62bd9');
```

### D1DataProvider Processing
```typescript
async getWaterStationById(stationId: string): Promise<Business | null> {
  try {
    // EndpointBuilder.waterStationById(stationId) returns '/api/water-stations/2b32f46c-73ff-426a-ac8b-96693cf62bd9'
    const station = await this.apiRequest<Business>(EndpointBuilder.waterStationById(stationId));
    return station;
  } catch (error) {
    console.error(`Failed to get water station by ID ${stationId}:`, error);
    return null;
  }
}
```

### HTTP Request
```
GET https://water-refill.near-me.us/api/water-stations/2b32f46c-73ff-426a-ac8b-96693cf62bd9
```

### Function Execution
```typescript
// functions/api/water-stations/[stationId].ts
const result = await env.DB.prepare(`
  SELECT * FROM businesses 
  WHERE id = ? AND category = 'water-refill' AND status = 'active'
`).bind(stationId).first();
```

### Response
```json
{
  "id": "2b32f46c-73ff-426a-ac8b-96693cf62bd9",
  "name": "SFO Water Filling Station",
  "category": "water-refill",
  "address": "SFO Terminal 3 Concourse E, San Francisco, CA 94128",
  // ... more fields
}
```

## Architecture Benefits

### 1. **Separation of Concerns**
- **Frontend**: UI logic, user interactions
- **D1DataProvider**: HTTP client, error handling, data formatting
- **API Functions**: Business logic, database queries, response formatting
- **Database**: Data storage

### 2. **Type Safety**
- `ApiEndpoints` enum prevents endpoint typos
- TypeScript interfaces ensure data structure consistency
- Compile-time checking catches errors early

### 3. **Maintainability**
- Single source of truth for all endpoints
- Easy to add new endpoints or modify existing ones
- Clear separation makes debugging easier

### 4. **Scalability**
- Functions run serverlessly on Cloudflare's edge
- Database queries are optimized and cached
- Easy to add new data sources or modify existing ones

### 5. **Error Handling**
- Centralized error handling in `apiRequest()`
- Graceful fallbacks in D1DataProvider methods
- Proper HTTP status codes from functions

## Common Patterns

### GET Requests (Read Data)
```typescript
// Simple endpoint
const data = await this.apiRequest<DataType>(ApiEndpoints.ENDPOINT_NAME);

// Dynamic endpoint with parameters
const data = await this.apiRequest<DataType>(EndpointBuilder.methodName(param));
```

### POST Requests (Submit Data)
```typescript
const result = await this.apiRequest<SubmissionResult>(ApiEndpoints.SUBMIT_ENDPOINT, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Error Handling Pattern
```typescript
async someMethod(): Promise<DataType | null> {
  try {
    const data = await this.apiRequest<DataType>(endpoint);
    return data;
  } catch (error) {
    console.error('Operation failed:', error);
    return null; // or appropriate fallback
  }
}
```

## Environment Variables

The system relies on these environment variables:

- `VITE_API_BASE_URL`: Base URL for API requests
- `VITE_D1_API_KEY`: API key for authentication
- `VITE_USE_D1`: Flag to enable D1 data provider

## Files Overview

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/providers/D1DataProvider.ts` | HTTP client for API requests | `D1DataProvider` class |
| `src/config/endpoints.ts` | Endpoint definitions | `ApiEndpoints` enum, `EndpointBuilder` |
| `functions/api/*.ts` | Server-side API handlers | `onRequestGet`, `onRequestPost`, etc. |
| `functions/types.ts` | Server-side types | `Env`, `D1Database`, etc. |

## Summary

The data flow architecture provides a clean, maintainable, and scalable way to handle all data operations in the Near Me application. By separating concerns and using type-safe endpoint management, the system is both robust and easy to extend.

**Key Principle**: D1DataProvider is purely an HTTP client - it never touches the database directly. All database operations happen in the Cloudflare Functions layer, maintaining clear separation between frontend and backend concerns.
