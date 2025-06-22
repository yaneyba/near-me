# Dynamic Subdomain System Guide

## Overview

This React application demonstrates a powerful dynamic subdomain system that creates unique, SEO-friendly pages for different business categories and cities. Each subdomain combination generates a tailored experience with relevant content, search functionality, and local business listings.

## How It Works

### Subdomain Structure
The system uses a 4-part subdomain structure:
```
[category].[city].near-me.us
```

**Examples:**
- `nail-salons.dallas.near-me.us` - Nail salons in Dallas
- `auto-repair.denver.near-me.us` - Auto repair shops in Denver
- `restaurants.austin.near-me.us` - Restaurants in Austin

### URL Parsing Logic

The `subdomainParser.ts` utility handles the core logic:

1. **Development Mode**: Defaults to "Nail Salons" in "Dallas" for localhost
2. **Production Mode**: Parses the actual subdomain structure
3. **Fallback**: Returns default values for invalid subdomains

```typescript
// Example parsing
hostname: "nail-salons.dallas.near-me.us"
↓
category: "Nail Salons"
city: "Dallas" 
state: "Texas"
```

### Data Filtering

The system automatically filters content based on the parsed subdomain:

- **Business Listings**: Shows only businesses matching the category and city
- **Services**: Displays services relevant to the category
- **SEO Content**: Generates category and location-specific titles and descriptions

## Key Features

### 1. Dynamic Content Generation
- **Page Titles**: "Best [Category] in [City], [State]"
- **Hero Sections**: Customized headlines and descriptions
- **Business Listings**: Filtered by location and category
- **Services**: Category-specific service offerings

### 2. Smart Search System
- **Live Results**: Real-time search suggestions as you type
- **Context Aware**: Searches within the current category/city context
- **Multiple Match Types**: Business names, services, neighborhoods
- **Recent Searches**: Remembers user search history

### 3. SEO Optimization
- **Dynamic Titles**: Each subdomain gets unique page titles
- **Meta Descriptions**: Location and category-specific descriptions
- **Structured URLs**: Clean, readable subdomain structure
- **Internal Linking**: Cross-links between categories and cities

### 4. Responsive Design
- **Mobile First**: Optimized for all device sizes
- **Touch Friendly**: Large tap targets and smooth interactions
- **Fast Loading**: Optimized images and efficient data loading

## Development Features

### Development Panel
A floating panel (visible only in development) allows you to:
- Switch between different categories
- Change cities to test different combinations
- See the simulated URL structure
- Apply changes without page refresh

**Access**: Click the settings icon in the bottom-right corner

### Local Testing
For local development, the system defaults to:
- Category: "Nail Salons"
- City: "Dallas"
- State: "Texas"

## Data Structure

### Business Data (`businesses.json`)
```json
{
  "id": "unique-id",
  "name": "Business Name",
  "category": "nail-salons",  // kebab-case
  "city": "dallas",           // kebab-case
  "state": "Texas",
  "address": "Full Address",
  "phone": "(555) 123-4567",
  "website": "https://example.com",
  "rating": 4.8,
  "reviewCount": 156,
  "description": "Business description",
  "services": ["Service 1", "Service 2"],
  "neighborhood": "Downtown",
  "hours": { "Monday": "9:00 AM - 7:00 PM" },
  "image": "https://images.pexels.com/..."
}
```

### Services Data (`services.json`)
```json
{
  "nail-salons": ["Manicures", "Pedicures", "Nail Art"],
  "auto-repair": ["Oil Changes", "Brake Repair", "Diagnostics"]
}
```

### City-State Mapping (`subdomainParser.ts`)
```typescript
const cityStateMap = {
  'dallas': 'Texas',
  'denver': 'Colorado',
  'austin': 'Texas'
  // ... more cities
};
```

## Adding New Content

### Adding a New City
1. **Update City-State Map**:
   ```typescript
   // In subdomainParser.ts
   const cityStateMap = {
     'new-city': 'State Name'
   };
   ```

2. **Add Business Data**:
   ```json
   // In businesses.json
   {
     "city": "new-city",
     "category": "existing-category"
     // ... other fields
   }
   ```

3. **Add Neighborhoods** (optional):
   ```json
   // In neighborhoods.json
   {
     "new-city": ["Downtown", "Uptown", "Suburbs"]
   }
   ```

### Adding a New Category
1. **Add Services**:
   ```json
   // In services.json
   {
     "new-category": ["Service 1", "Service 2", "Service 3"]
   }
   ```

2. **Add Business Data**:
   ```json
   // In businesses.json
   {
     "category": "new-category",
     "city": "existing-city"
     // ... other fields
   }
   ```

3. **Update Development Panel**:
   ```typescript
   // In DevPanel.tsx
   const categories = [
     'Existing Category',
     'New Category'  // Add here
   ];
   ```

## URL Examples and Their Results

| URL | Category | City | State | Content |
|-----|----------|------|-------|---------|
| `nail-salons.dallas.near-me.us` | Nail Salons | Dallas | Texas | Dallas nail salons |
| `auto-repair.denver.near-me.us` | Auto Repair | Denver | Colorado | Denver auto repair |
| `restaurants.austin.near-me.us` | Restaurants | Austin | Texas | Austin restaurants |
| `hair-salons.chicago.near-me.us` | Hair Salons | Chicago | Illinois | Chicago hair salons |

## Search Functionality

### How Search Works
1. **Real-time Filtering**: As users type, results update instantly
2. **Multiple Match Types**:
   - Business names
   - Service offerings
   - Neighborhood names
3. **Smart Suggestions**: Shows relevant suggestions with context
4. **Recent History**: Remembers and suggests recent searches

### Search Features
- **Live Results**: No need to press enter
- **Keyboard Navigation**: Arrow keys to navigate suggestions
- **Context Aware**: Searches within current category/city
- **Visual Feedback**: Highlights matching text
- **Mobile Optimized**: Touch-friendly interface

## Performance Considerations

### Data Loading
- **JSON-based**: Fast loading from static files
- **Client-side Filtering**: Instant category/city switching
- **Lazy Loading**: Images load as needed
- **Caching**: Browser caches static data

### SEO Benefits
- **Unique URLs**: Each subdomain is a unique page
- **Dynamic Titles**: Search engine friendly titles
- **Structured Data**: Clean HTML structure
- **Fast Loading**: Optimized for Core Web Vitals

## Deployment Considerations

### DNS Setup
For production, you'll need:
1. **Wildcard DNS**: `*.near-me.us` pointing to your server
2. **SSL Certificate**: Wildcard SSL for all subdomains
3. **Server Configuration**: Handle subdomain routing

### Scaling
- **Add More Data**: Simply update JSON files
- **New Categories**: Add to services.json and business data
- **New Cities**: Update city-state mapping and add businesses
- **API Integration**: Replace JsonDataProvider with API calls

## Troubleshooting

### Common Issues

**Subdomain not parsing correctly**
- Check hostname format: `category.city.near-me.us`
- Verify city exists in cityStateMap
- Ensure category uses kebab-case

**No businesses showing**
- Verify business data has matching category and city
- Check that category/city are in kebab-case in data
- Confirm data files are loading correctly

**Search not working**
- Check that businesses array is populated
- Verify search query is being passed correctly
- Ensure business data has searchable fields

**Development panel not showing**
- Only visible in development mode
- Check if hostname includes 'localhost' or 'stackblitz'
- Verify NODE_ENV or development detection

## Best Practices

### Data Management
- **Consistent Naming**: Use kebab-case for categories and cities
- **Complete Data**: Ensure all required fields are present
- **Quality Images**: Use high-quality, relevant images
- **Accurate Information**: Keep business data up-to-date

### SEO Optimization
- **Unique Content**: Each subdomain should have unique value
- **Local Keywords**: Include location-specific terms
- **Quality Descriptions**: Write compelling business descriptions
- **Internal Linking**: Link between related categories/cities

### User Experience
- **Fast Loading**: Optimize images and data loading
- **Mobile First**: Design for mobile users primarily
- **Clear Navigation**: Make it easy to find information
- **Search Functionality**: Provide powerful search tools

This system provides a scalable foundation for location-based business directories with excellent SEO potential and user experience.