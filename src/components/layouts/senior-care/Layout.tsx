/**
 * Senior Care Layout - Custom Layout Implementation
 * 
 * This layout uses the generic CustomLayout component with senior care
 * specific configuration. This approach makes it easy to create new
 * custom layouts for other categories in the future.
 */

import React from 'react';
import { SubdomainInfo } from '@/types';
import CustomLayout from '@/components/layouts/CustomLayout';
import { seniorCareConfig } from '@/config/customLayouts';

interface SeniorCareLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  showSearchBar?: boolean;
  hideAllBelowHeader?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  currentSearchQuery?: string;
}

const SeniorCareLayout: React.FC<SeniorCareLayoutProps> = (props) => {
  return (
    <CustomLayout 
      {...props}
      config={seniorCareConfig}
    />
  );
};

export default SeniorCareLayout;
