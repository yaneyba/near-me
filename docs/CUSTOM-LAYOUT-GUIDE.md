# Custom Layout Architecture Guide

## Overview

The Custom Layout system provides a flexible, configurable approach to creating specialized layouts for business categories that need unique branding, messaging, and UI elements. This system replaces category-specific layout components with a single, configurable `CustomLayout` component.

## Architecture

### Core Components

1. **CustomLayout.tsx** - The main configurable layout component
2. **CustomLayoutConfig** - TypeScript interface defining configuration structure
3. **Category Configurations** - Individual config files for each category
4. **Category Layout Wrappers** - Simple components that apply specific configurations

### Benefits

- **Reusability**: One layout component serves multiple categories
- **Consistency**: Standardized structure across all custom layouts
- **Maintainability**: Changes to core functionality apply to all categories
- **Scalability**: Easy to add new categories without duplicating code
- **Flexibility**: Comprehensive configuration options for customization

## Creating a New Custom Layout

### Step 1: Create Configuration

Create a new configuration file in `src/config/customLayouts/`:

```typescript
// src/config/customLayouts/myNewCategoryConfig.ts
import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';

export const myNewCategoryConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'MyBrandName',
  logoComponent: MyLogo, // Optional custom logo component
  
  // Colors and theming
  primaryColor: 'purple-600',     // Main brand color
  gradientFrom: 'purple-500',     // Hero gradient start
  gradientTo: 'purple-700',       // Hero gradient end
  accentColor: 'purple-100',      // Accent/secondary color
  
  // Hero section content
  heroTitle: 'Find Amazing Services Near You',
  heroSubtitle: 'Discover the best services in your area with our comprehensive directory.',
  ctaText: 'Find Services Near Me',
  searchPlaceholder: 'Search by location, service, or provider...',
  
  // Navigation items
  navItems: [
    { label: 'Find Services', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Sign In', href: '/login' }
  ],
  
  // Statistics to display
  stats: [
    { value: '1,000+', label: 'Verified Providers' },
    { value: '25+', label: 'Cities' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '24/7', label: 'Support' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Popular Service 1',
    'Popular Service 2',
    'Popular Service 3'
  ],
  
  // Category identifier
  categoryKey: 'my-new-category'
};
```

### Step 2: Update Configuration Index

Add your configuration to `src/config/customLayouts/index.ts`:

```typescript
// Add import
import { myNewCategoryConfig } from './myNewCategoryConfig';

// Add to exports
export { myNewCategoryConfig } from './myNewCategoryConfig';

// Update type
export type CustomLayoutKey = 'water-refill' | 'ev-charging' | 'food-delivery' | 'my-new-category';

// Update registry
export const customLayoutConfigs = {
  'water-refill': waterRefillConfig,
  'ev-charging': evChargingConfig,
  'food-delivery': foodDeliveryConfig,
  'my-new-category': myNewCategoryConfig
} as const;
```

### Step 3: Create Layout Wrapper

Create a simple wrapper component in `src/components/layouts/my-new-category/`:

```typescript
// src/components/layouts/my-new-category/Layout.tsx
import React from 'react';
import { SubdomainInfo } from '@/types';
import CustomLayout from '@/components/layouts/CustomLayout';
import { myNewCategoryConfig } from '@/config/customLayouts';

interface MyNewCategoryLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  showSearchBar?: boolean;
  hideAllBelowHeader?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  currentSearchQuery?: string;
}

const MyNewCategoryLayout: React.FC<MyNewCategoryLayoutProps> = (props) => {
  return (
    <CustomLayout 
      {...props}
      config={myNewCategoryConfig}
    />
  );
};

export default MyNewCategoryLayout;
```

### Step 4: Create Index Export

Create `src/components/layouts/my-new-category/index.ts`:

```typescript
export { default as Layout } from './Layout';
```

### Step 5: Use in Pages

Use the layout in your pages:

```typescript
import { Layout as MyNewCategoryLayout } from '@/components/layouts/my-new-category';

const MyPage = ({ subdomainInfo }) => {
  return (
    <MyNewCategoryLayout subdomainInfo={subdomainInfo}>
      {/* Your page content */}
    </MyNewCategoryLayout>
  );
};
```

## Configuration Options

### CustomLayoutConfig Interface

```typescript
interface CustomLayoutConfig {
  // Branding
  brandName: string;                    // Brand name displayed in header
  logoComponent?: React.ComponentType;  // Optional custom logo component
  
  // Colors and theming
  primaryColor: string;     // Main brand color (e.g., 'blue-600')
  gradientFrom: string;     // Hero gradient start color
  gradientTo: string;       // Hero gradient end color
  accentColor: string;      // Secondary/accent color
  
  // Hero section content
  heroTitle: string;        // Main hero headline
  heroSubtitle: string;     // Hero description text
  ctaText: string;          // Call-to-action button text
  searchPlaceholder: string; // Search input placeholder
  
  // Navigation
  navItems: Array<{
    label: string;          // Navigation item text
    href: string;           // Navigation item URL
  }>;
  
  // Statistics section
  stats: Array<{
    value: string;          // Statistic value (e.g., '2,500+')
    label: string;          // Statistic description
  }>;
  
  // Search functionality
  popularSuggestions: string[];  // Popular search suggestions
  
  // System
  categoryKey: string;      // Unique category identifier
}
```

### Color Theming

The system uses Tailwind CSS color classes. Supported colors include:
- `blue-600`, `green-600`, `purple-600`, `red-600`, `orange-600`, etc.
- The system automatically generates hover and active states
- Gradient colors should use lighter shades (e.g., `blue-500` to `blue-700`)

### Logo Integration

If you have a custom logo component:

1. Create your logo component following the interface:
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
  theme?: 'light' | 'dark';
  onClick?: () => void;
}
```

2. Import and reference it in your configuration:
```typescript
import { MyCustomLogo } from '@/components/my-category';

export const myConfig: CustomLayoutConfig = {
  // ...
  logoComponent: MyCustomLogo,
  // ...
};
```

## Examples

See the following example configurations:

- **Water Refill Stations**: `src/config/customLayouts/waterRefillConfig.ts`
- **EV Charging Stations**: `src/config/customLayouts/evChargingConfig.ts`
- **Food Delivery**: `src/config/customLayouts/foodDeliveryConfig.ts`

## Migration from Legacy Layouts

To migrate an existing custom layout:

1. Extract configuration values from the old layout component
2. Create a new configuration file using those values
3. Replace the layout component with a wrapper using CustomLayout
4. Test thoroughly to ensure functionality is preserved
5. Remove the old layout component

## Best Practices

1. **Consistent Branding**: Use consistent color schemes that match your brand
2. **Meaningful Statistics**: Include relevant, impressive statistics for your category
3. **Clear Navigation**: Keep navigation simple and category-appropriate
4. **Search Optimization**: Provide helpful search suggestions for your category
5. **Responsive Design**: The layout is mobile-first and responsive by default
6. **Accessibility**: All components follow accessibility best practices

## Future Enhancements

The Custom Layout system is designed to be extensible. Future enhancements might include:

- Additional theming options (fonts, spacing, etc.)
- More flexible layout variations
- Advanced customization hooks
- Dynamic configuration loading
- A/B testing support

## Support

For questions or issues with the Custom Layout system, refer to:
- This documentation
- TypeScript interfaces for exact configuration options
- Example configurations in the codebase
- The main DEPLOYMENT-GUIDE.md for broader context
