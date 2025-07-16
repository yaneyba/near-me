/**
 * Specialty Pet Layout - Custom Layout Implementation
 * 
 * This layout uses the generic CustomLayout component with specialty pet
 * specific configuration. This approach makes it easy to create new
 * custom layouts for other categories in the future.
 */

import React from 'react';
import { SubdomainInfo } from '@/types';
import CustomLayout from '@/components/layouts/CustomLayout';
import { specialtyPetConfig } from '@/config/customLayouts';

interface SpecialtyPetLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  showSearchBar?: boolean;
  hideAllBelowHeader?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  currentSearchQuery?: string;
}

const SpecialtyPetLayout: React.FC<SpecialtyPetLayoutProps> = (props) => {
  return (
    <CustomLayout 
      {...props}
      config={specialtyPetConfig}
    />
  );
};

export default SpecialtyPetLayout;
