/**
 * Water Refill Layout - Custom Layout Implementation
 * 
 * This layout uses the generic CustomLayout component with water refill
 * specific configuration. This approach makes it easy to create new
 * custom layouts for other categories in the future.
 */

import React from 'react';
import { SubdomainInfo } from '@/types';
import CustomLayout from '@/components/layouts/CustomLayout';
import { waterRefillConfig } from '@/config/customLayouts';

interface WaterRefillLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  showSearchBar?: boolean;
  hideAllBelowHeader?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  currentSearchQuery?: string;
}

const WaterRefillLayout: React.FC<WaterRefillLayoutProps> = (props) => {
  return (
    <CustomLayout 
      {...props}
      config={waterRefillConfig}
    />
  );
};

export default WaterRefillLayout;
