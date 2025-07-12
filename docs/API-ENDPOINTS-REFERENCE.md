# API Endpoints Reference

This document provides an overview of all available API endpoints managed through the `ApiEndpoints` enum.

## Core Business Data Endpoints

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/api/businesses` | Get businesses by category and city | `EndpointBuilder.businessesWithParams(category, city)` |
| `/api/services` | Get services for a category | `EndpointBuilder.servicesWithCategory(category)` |
| `/api/neighborhoods` | Get neighborhoods for a city | `EndpointBuilder.neighborhoodsWithCity(city)` |
| `/api/cities` | Get all cities | `ApiEndpoints.CITIES` or `EndpointBuilder.citiesWithState(true)` |

## Individual Business Lookup

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/api/business/{id}` | Get business by ID | `EndpointBuilder.businessById(id)` |
| `/api/water-stations/{stationId}` | Get water station by ID | `EndpointBuilder.waterStationById(stationId)` |

## Submission Endpoints

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/api/contact` | Submit contact form | `ApiEndpoints.CONTACT` |
| `/api/submit-business` | Submit business application | `ApiEndpoints.SUBMIT_BUSINESS` |

## Analytics & Tracking

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/api/track-engagement` | Track user engagement events | `ApiEndpoints.TRACK_ENGAGEMENT` |

## Admin Endpoints

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/api/admin/business-submissions` | Manage business submissions | `ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS` |
| `/api/admin/business-profiles` | Get business profiles | `ApiEndpoints.ADMIN_BUSINESS_PROFILES` |
| `/api/admin/contact-messages` | Manage contact messages | `ApiEndpoints.ADMIN_CONTACT_MESSAGES` |
| `/api/admin/businesses` | Get all businesses | `EndpointBuilder.adminBusinessesWithType(type)` |
| `/api/admin/stats` | Get admin dashboard stats | `ApiEndpoints.ADMIN_STATS` |
| `/api/admin/engagement` | Manage engagement data | `ApiEndpoints.ADMIN_ENGAGEMENT` |

## Usage Examples

```typescript
import { ApiEndpoints, EndpointBuilder } from '@/config/endpoints';

// Get businesses in San Francisco nail salons
const endpoint = EndpointBuilder.businessesWithParams('nail-salons', 'san-francisco');

// Get a specific water station
const stationEndpoint = EndpointBuilder.waterStationById('2b32f46c-73ff-426a-ac8b-96693cf62bd9');

// Submit contact form
const contactEndpoint = ApiEndpoints.CONTACT;

// Get cities with state information
const citiesWithState = EndpointBuilder.citiesWithState(true);
```

## Benefits

- **Type Safety**: All endpoints are strongly typed
- **Centralized Management**: Single source of truth for all API routes
- **IDE Support**: Full IntelliSense and autocomplete
- **Refactoring Safe**: Changing an endpoint updates all usages
- **Documentation**: Self-documenting API structure
- **Validation**: Built-in endpoint validation functions

## Highlighted Endpoint: Water Stations

The `/api/water-stations/{stationId}` endpoint provides direct lookup for water refill stations:

```typescript
// Direct lookup - highly optimized
const stationId = '2b32f46c-73ff-426a-ac8b-96693cf62bd9';
const endpoint = EndpointBuilder.waterStationById(stationId);
// Results in: '/api/water-stations/2b32f46c-73ff-426a-ac8b-96693cf62bd9'
```

This endpoint was specifically created to solve the UUID lookup performance issue and is now the primary method for accessing individual water stations.
