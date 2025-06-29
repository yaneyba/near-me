# Complete Ads How-To Guide: Dynamic Subdomain Business Directory

## Table of Contents

1. [Ads System Overview](#ads-system-overview)
2. [Setting Up Google AdSense](#setting-up-google-adsense)
3. [Configuration Guide](#configuration-guide)
4. [Ad Placement Strategy](#ad-placement-strategy)
5. [Managing Ad Units](#managing-ad-units)
6. [Sponsored Content](#sponsored-content)
7. [Performance Optimization](#performance-optimization)
8. [Revenue Tracking](#revenue-tracking)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Ads System Overview

### What's Included

The dynamic subdomain directory includes a comprehensive advertising system with:

- **Google AdSense Integration** - Automated ad serving
- **Strategic Ad Placement** - Header, sidebar, footer, and between content
- **Sponsored Content** - Premium business listings and sponsored posts
- **Responsive Design** - Ads adapt to all screen sizes
- **User Controls** - Close buttons and non-intrusive design
- **Performance Tracking** - Built-in analytics integration

### Ad Types Supported

1. **Display Ads** (Google AdSense)
   - Banner ads (728x90)
   - Rectangle ads (300x250)
   - Sidebar ads (300x600)
   - Mobile banners (320x50)

2. **Sponsored Content**
   - Premium business listings
   - Sponsored business cards
   - Featured placements

3. **Native Advertising**
   - Contextual business recommendations
   - Related service suggestions

---

## Setting Up Google AdSense

### Step 1: Create AdSense Account

1. **Apply for AdSense**
   - Go to [Google AdSense](https://www.google.com/adsense/)
   - Click "Get started"
   - Add your website: `near-me.us`
   - Choose your country/region
   - Select payment currency

2. **Website Review Process**
   - Google will review your site (typically 1-14 days)
   - Ensure your site has quality content
   - Make sure you have privacy policy and terms of service
   - Have sufficient traffic (recommended: 100+ daily visitors)

3. **Get Approval**
   - Once approved, you'll receive your Publisher ID
   - Format: `ca-pub-1234567890123456`

### Step 2: Create Ad Units

1. **Access AdSense Dashboard**
   - Log into your AdSense account
   - Navigate to "Ads" → "By ad unit"

2. **Create Display Ad Units**

   **Header Leaderboard (728x90)**
   ```
   Name: Header Leaderboard - Near Me Directory
   Size: 728x90 (Leaderboard)
   Ad type: Display ads
   ```

   **Sidebar Rectangle (300x600)**
   ```
   Name: Sidebar Skyscraper - Near Me Directory  
   Size: 300x600 (Half page)
   Ad type: Display ads
   ```

   **Footer Banner (728x90)**
   ```
   Name: Footer Banner - Near Me Directory
   Size: 728x90 (Leaderboard)  
   Ad type: Display ads
   ```

   **Between Listings (Responsive)**
   ```
   Name: Between Listings - Near Me Directory
   Size: Responsive
   Ad type: Display ads
   ```

   **Mobile Banner (320x50)**
   ```
   Name: Mobile Banner - Near Me Directory
   Size: 320x50 (Mobile banner)
   Ad type: Display ads
   ```

3. **Get Ad Unit Codes**
   - Copy the slot ID for each ad unit (e.g., `1234567890`)
   - You'll need these for configuration

---

## Configuration Guide

### Environment Variables Setup

1. **Update .env File**
   ```env
   # Ads Configuration
   VITE_ENABLE_ADS=true
   VITE_ADS_PROVIDER=google
   VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-1234567890123456
   VITE_GOOGLE_ADS_SLOT_HEADER=1234567890
   VITE_GOOGLE_ADS_SLOT_SIDEBAR=2345678901
   VITE_GOOGLE_ADS_SLOT_FOOTER=3456789012
   VITE_GOOGLE_ADS_SLOT_BETWEEN_LISTINGS=4567890123
   ```

2. **Production Environment**
   
   For Cloudflare Pages, add these environment variables in your dashboard:
   - Go to your Cloudflare Pages project
   - Navigate to Settings → Environment variables
   - Add each variable for Production environment

### Enabling/Disabling Ads

**To Enable Ads:**
```env
VITE_ENABLE_ADS=true
```

**To Disable Ads:**
```env
VITE_ENABLE_ADS=false
```

**To Test Ads in Development:**
```env
VITE_ENABLE_ADS=true
# Use test ad units or your real ones for testing
```

---

## Ad Placement Strategy

### Current Ad Placements

The system strategically places ads for maximum visibility and revenue:

#### 1. Header Ad (Leaderboard 728x90)
- **Location**: Top of every page, below navigation
- **Visibility**: High - seen by all visitors
- **Best for**: Brand awareness, high-impact campaigns
- **Revenue potential**: High

#### 2. Sidebar Ad (Skyscraper 300x600)
- **Location**: Right sidebar on desktop
- **Visibility**: Medium-High - visible during browsing
- **Best for**: Vertical display ads, local businesses
- **Revenue potential**: Medium-High

#### 3. Footer Ad (Leaderboard 728x90)
- **Location**: Bottom of every page
- **Visibility**: Medium - seen by engaged users
- **Best for**: Retargeting, complementary services
- **Revenue potential**: Medium

#### 4. Between Listings (Responsive)
- **Location**: Every 6-9 business listings
- **Visibility**: High - integrated with content
- **Best for**: Native advertising, related services
- **Revenue potential**: Very High

#### 5. Mobile Ads
- **Location**: Responsive placement on mobile devices
- **Visibility**: High on mobile
- **Best for**: Mobile-optimized campaigns
- **Revenue potential**: High (mobile traffic)

### Ad Placement Code

The ads are automatically placed using the `AdUnit` component:

```typescript
// Header Ad
<AdUnit
  slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_HEADER}
  size="leaderboard"
  className="flex justify-center"
  label="Advertisement"
/>

// Sidebar Ad  
<AdUnit
  slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_SIDEBAR}
  size="sidebar"
  label="Sponsored"
/>

// Between Listings
<AdUnit
  slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_BETWEEN_LISTINGS}
  size="leaderboard"
  className="my-6"
  label="Sponsored"
/>
```

---

## Managing Ad Units

### AdUnit Component Features

The `AdUnit` component (`src/components/ads/AdUnit.tsx`) provides:

- **Responsive Design** - Adapts to screen size
- **Loading States** - Shows placeholder while loading
- **Error Handling** - Graceful fallbacks
- **User Controls** - Close button for better UX
- **Performance** - Lazy loading and optimization

### AdUnit Props

```typescript
interface AdUnitProps {
  slot: string;           // AdSense slot ID
  size: 'banner' | 'rectangle' | 'leaderboard' | 'sidebar' | 'mobile-banner';
  className?: string;     // Additional CSS classes
  label?: string;         // Ad label (default: "Advertisement")
  responsive?: boolean;   // Enable responsive sizing
}
```

### Adding New Ad Placements

1. **Create New Ad Unit in AdSense**
   - Log into AdSense dashboard
   - Create new ad unit
   - Copy the slot ID

2. **Add Environment Variable**
   ```env
   VITE_GOOGLE_ADS_SLOT_NEW_PLACEMENT=9876543210
   ```

3. **Place Ad in Component**
   ```tsx
   <AdUnit
     slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_NEW_PLACEMENT}
     size="rectangle"
     className="my-4"
     label="Sponsored"
   />
   ```

### Customizing Ad Appearance

**Custom Styling:**
```tsx
<AdUnit
  slot="1234567890"
  size="banner"
  className="rounded-lg shadow-md border border-gray-200"
  label="Featured Partners"
/>
```

**Responsive Behavior:**
```tsx
<AdUnit
  slot="1234567890"
  size="banner"
  responsive={true}  // Adapts to container width
  className="w-full max-w-4xl mx-auto"
/>
```

---

## Sponsored Content

### Premium Business Listings

Premium businesses get enhanced visibility through:

1. **Premium Badges** - Crown icons and special styling
2. **Priority Placement** - Appear first in listings
3. **Enhanced Cards** - Larger, more prominent display
4. **Special Effects** - Glow effects and animations

### SponsoredContent Component

The `SponsoredContent` component creates native advertising:

```typescript
<SponsoredContent 
  category={category}
  city={city}
  className="my-4"
/>
```

**Features:**
- Contextual business recommendations
- Premium styling with yellow/gold theme
- Special offers and promotions
- Clear "Sponsored" labeling
- Call-to-action buttons

### Managing Sponsored Content

1. **Enable Sponsored Content**
   ```env
   VITE_ENABLE_ADS=true
   ```

2. **Customize Sponsored Businesses**
   
   Edit `src/components/ads/SponsoredContent.tsx`:
   ```typescript
   const sponsoredBusinesses = [
     {
       id: 'sponsored-1',
       name: `Premium ${category} Service`,
       description: `Top-rated ${category.toLowerCase()} serving ${city}...`,
       rating: 4.9,
       reviewCount: 250,
       phone: '(555) 123-SPONSOR',
       website: 'https://example.com',
       specialOffer: '20% off first service',
       image: 'https://images.pexels.com/photos/...'
     }
   ];
   ```

3. **Dynamic Sponsored Content**
   
   For dynamic sponsored content, integrate with your business database:
   ```typescript
   // Fetch sponsored businesses from API
   const sponsoredBusinesses = await fetchSponsoredBusinesses(category, city);
   ```

---

## Performance Optimization

### Ad Loading Optimization

1. **Lazy Loading**
   - Ads load only when visible
   - Reduces initial page load time
   - Improves Core Web Vitals

2. **Async Loading**
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
   ```

3. **Error Handling**
   - Graceful fallbacks for ad failures
   - Placeholder content while loading
   - No broken layouts

### Core Web Vitals Impact

**Optimizations Included:**
- Ads don't block page rendering
- Proper size reservations prevent layout shift
- Efficient loading reduces impact on LCP
- Minimal JavaScript for better FID

### Performance Monitoring

**Key Metrics to Track:**
- Page load speed with/without ads
- Layout Shift (CLS) scores
- Ad viewability rates
- Revenue per page view

**Tools:**
- Google PageSpeed Insights
- Cloudflare Analytics
- AdSense Performance reports

---

## Revenue Tracking

### AdSense Analytics

1. **Access AdSense Reports**
   - Log into AdSense dashboard
   - Navigate to "Reports"
   - View earnings by date, ad unit, page

2. **Key Metrics**
   - **RPM** (Revenue per 1000 impressions)
   - **CTR** (Click-through rate)
   - **CPC** (Cost per click)
   - **Impressions** (Ad views)
   - **Clicks** (Ad clicks)

3. **Custom Reports**
   - Filter by ad unit
   - Compare performance by subdomain
   - Track seasonal trends

### Google Analytics Integration

**Enhanced E-commerce Tracking:**
```javascript
// Track ad clicks
gtag('event', 'ad_click', {
  'ad_unit_name': 'header_leaderboard',
  'value': 0.50
});

// Track sponsored content engagement
gtag('event', 'sponsored_click', {
  'business_name': 'Premium Service',
  'category': 'nail-salons',
  'city': 'dallas'
});
```

### Revenue Optimization

**A/B Testing:**
- Test different ad placements
- Compare ad sizes and formats
- Test sponsored content variations

**Seasonal Adjustments:**
- Increase ad density during peak seasons
- Adjust sponsored content for holidays
- Optimize for local events

---

## Troubleshooting

### Common Issues

#### 1. Ads Not Showing

**Possible Causes:**
- AdSense account not approved
- Incorrect slot IDs
- Ad blockers
- Policy violations

**Solutions:**
```bash
# Check environment variables
echo $VITE_ENABLE_ADS
echo $VITE_GOOGLE_ADS_CLIENT_ID

# Verify in browser console
console.log(import.meta.env.VITE_ENABLE_ADS);
```

#### 2. Layout Issues

**Problem:** Ads causing layout shift
**Solution:** Reserve space for ads
```css
.ad-container {
  min-height: 90px; /* For leaderboard */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 3. Mobile Ad Problems

**Problem:** Ads not responsive on mobile
**Solution:** Use responsive ad units
```tsx
<AdUnit
  slot="1234567890"
  size="mobile-banner"
  responsive={true}
/>
```

#### 4. Low Revenue

**Possible Causes:**
- Low traffic
- Poor ad placement
- Ad blocker usage
- Non-relevant ads

**Solutions:**
- Improve SEO for more traffic
- Optimize ad placements
- Add more content
- Use better keywords

### Debug Mode

**Enable Debug Logging:**
```typescript
// In AdUnit component
if (process.env.NODE_ENV === 'development') {
  console.log('Ad Unit Debug:', {
    slot,
    size,
    clientId,
    isLoaded
  });
}
```

### Testing Ads

**Development Testing:**
1. Use real ad units with low traffic
2. Test on different devices
3. Check ad loading in network tab
4. Verify responsive behavior

**Production Testing:**
1. Monitor AdSense reports
2. Check for policy violations
3. Test user experience
4. Monitor page speed impact

---

## Best Practices

### Ad Placement Guidelines

1. **Above the Fold**
   - Place at least one ad above the fold
   - Don't overwhelm with too many ads
   - Maintain content-to-ad ratio

2. **Content Integration**
   - Blend ads naturally with content
   - Use relevant ad placements
   - Maintain user experience

3. **Mobile Optimization**
   - Use mobile-specific ad sizes
   - Ensure touch-friendly spacing
   - Test on various devices

### Revenue Optimization

1. **Traffic Quality**
   - Focus on organic traffic
   - Target high-value keywords
   - Improve user engagement

2. **Ad Relevance**
   - Use contextual targeting
   - Optimize for local businesses
   - Match ads to content

3. **User Experience**
   - Don't overload with ads
   - Provide value-first content
   - Maintain fast loading speeds

### Compliance and Policies

1. **AdSense Policies**
   - No click encouragement
   - No adult content
   - Proper ad labeling
   - Valid traffic only

2. **Privacy Compliance**
   - GDPR compliance for EU users
   - CCPA compliance for California
   - Clear privacy policy
   - Cookie consent

3. **Content Guidelines**
   - High-quality, original content
   - Regular content updates
   - User-focused design
   - Mobile-friendly layout

### Monitoring and Maintenance

1. **Regular Checks**
   - Monitor AdSense account health
   - Check for policy violations
   - Review performance metrics
   - Test ad functionality

2. **Performance Optimization**
   - A/B test ad placements
   - Optimize for Core Web Vitals
   - Monitor user feedback
   - Adjust based on analytics

3. **Revenue Growth**
   - Increase quality traffic
   - Improve content relevance
   - Optimize ad viewability
   - Test new ad formats

---

## Advanced Features

### Custom Ad Targeting

**Geographic Targeting:**
```typescript
// Target ads based on city/state
const adConfig = {
  location: `${city}, ${state}`,
  category: category,
  targeting: 'local_business'
};
```

**Category-Specific Ads:**
```typescript
// Different ads for different categories
const getAdSlot = (category: string) => {
  const categorySlots = {
    'nail-salons': 'NAIL_SALON_SLOT_ID',
    'auto-repair': 'AUTO_REPAIR_SLOT_ID',
    'restaurants': 'RESTAURANT_SLOT_ID'
  };
  return categorySlots[category] || 'DEFAULT_SLOT_ID';
};
```

### Dynamic Ad Loading

**Load Ads Based on Content:**
```typescript
useEffect(() => {
  if (businesses.length > 10) {
    // Load additional ads for pages with more content
    loadAdditionalAds();
  }
}, [businesses]);
```

### Ad Performance Analytics

**Custom Tracking:**
```typescript
// Track ad performance by subdomain
const trackAdPerformance = (subdomain: string, adUnit: string) => {
  gtag('event', 'ad_impression', {
    'subdomain': subdomain,
    'ad_unit': adUnit,
    'timestamp': Date.now()
  });
};
```

This comprehensive ads guide covers everything you need to successfully implement, manage, and optimize the advertising system in your dynamic subdomain directory. The system is designed to be profitable while maintaining excellent user experience across all devices and subdomains.