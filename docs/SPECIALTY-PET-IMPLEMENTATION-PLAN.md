# Specialty Pet Custom Layout Implementation Plan

## Overview
Create a custom layout for specialty pet services following the established pattern used by water-refill and senior-care layouts.

## Step-by-Step Implementation Process

### Phase 1: Analysis & Configuration
1. **Study Existing Custom Layouts**
   - Examine water-refill layout structure
   - Examine senior-care layout structure
   - Identify common patterns and differences

2. **Update Configuration Files**
   - Add specialty-pet to `config/subdomain-generation.json`
   - Configure layout type, categories, and generation rules

### Phase 2: Database & Data Setup
3. **Database Schema**
   - Verify businesses table supports specialty-pet category
   - Add sample data if needed for testing

4. **Static Data Files**
   - Create data files if needed (following pattern of senior-care-dallas.csv)

### Phase 3: Core Implementation
5. **Routing & Components**
   - Create specialty pet specific components
   - Update routing configuration
   - Add subdomain parsing support

6. **Custom Layout Components**
   - Create SpecialtyPetLayout component
   - Create SpecialtyPetHomePage component
   - Implement custom styling and branding

### Phase 4: Configuration & Integration
7. **Hero Configuration**
   - Add specialty-pet hero config
   - Configure colors, branding, messaging

8. **Page Configuration**
   - Add page configs for specialty-pet
   - Set up meta tags, SEO, descriptions

9. **Subdomain Support**
   - Update subdomainExceptions.ts
   - Add specialty-pet as special service
   - Configure subdomain parsing

### Phase 5: Static Site Generation
10. **HTML Generation**
    - Update generate-subdomain-html.js
    - Add specialty-pet static HTML generation
    - Configure custom branding and footer

11. **Build & Deploy**
    - Test static generation
    - Verify all pages render correctly

### Phase 6: Testing & Validation
12. **Testing**
    - Test subdomain routing
    - Verify custom layout renders
    - Test API endpoints
    - Validate SEO meta tags

## File Structure to Create/Modify

### New Files:
```
src/components/layouts/specialty-pet/
├── SpecialtyPetLayout.tsx
├── SpecialtyPetHomePage.tsx
└── SpecialtyPetServices.tsx

src/config/customLayouts/
└── specialty-pet-config.ts

data/
└── specialty-pet-[city].csv (if needed)
```

### Files to Modify:
```
config/subdomain-generation.json
src/config/heroConfigs.ts
src/config/pageConfigs.ts
src/config/subdomainExceptions.ts
src/utils/subdomainParser.ts
src/components/routing/AppRoutes.tsx
scripts/generate-subdomain-html.js
```

## Success Criteria
- [ ] specialty-pet.near-me.us loads with custom layout
- [ ] Custom branding and styling applied
- [ ] Static HTML generation works
- [ ] Database integration functional
- [ ] SEO meta tags configured
- [ ] Subdomain routing works correctly

## Next Steps
Once this plan is approved, execute each phase in order, completing all steps before moving to the next phase.
