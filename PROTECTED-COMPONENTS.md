# 🚨 PROTECTED COMPONENTS - DO NOT DELETE

## Critical Development Tools

### DevPanel Component
**Location**: `src/components/DevPanel.tsx`  
**Status**: ⚠️ **PROTECTED - DO NOT DELETE**

**Why It's Critical**:
- Essential for testing different business categories and cities
- Allows dynamic subdomain simulation in development
- Required for content testing and debugging
- Used by developers to test routing and content changes

**Usage**:
- Accessible via gear icon in development mode
- Switch between categories: nail-salons, hair-salons, etc.
- Test different cities: san-antonio, austin, etc.
- Real-time preview of subdomain behavior

**Dependencies**:
- Imported in `Layout.tsx`
- Connected to subdomain parser utilities
- Integrated with routing system

### Other Protected Files
- `src/components/Layout.tsx` - Contains DevPanel integration
- `src/utils/subdomainParser.ts` - Powers DevPanel functionality
- Development environment variables - Enable DevPanel visibility

## ⚠️ Warning Signs

If you see any of these during cleanup:
- "DevPanel is unused" - **IGNORE, IT'S CRITICAL**
- "Remove development components" - **DO NOT REMOVE DevPanel**
- Linting errors about DevPanel - **FIX THE CODE, DON'T DELETE**

## Recovery Instructions

If DevPanel is accidentally deleted:
1. Check git history: `git log --oneline src/components/DevPanel.tsx`
2. Restore from backup: `git checkout HEAD~1 src/components/DevPanel.tsx`
3. Verify integration in Layout.tsx is intact
4. Test functionality by pressing gear icon in dev mode

**Remember: DevPanel is essential for development workflow!** 🛠️
