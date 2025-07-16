// Smart Door - The intelligent routing system for Near Me
// This component decides which "world" to show based on the URL

import React from 'react';
import { SubdomainInfo } from '@/types';

// Import the different "worlds"
import WaterRefillWorld from './WaterRefillWorld.tsx';
import SeniorCareWorld from './SeniorCareWorld.tsx';
import SpecialtyPetWorld from './SpecialtyPetWorld.tsx';
import BusinessWorld from './BusinessWorld.tsx';
import ServicesWorld from './ServicesWorld.tsx';

interface SmartDoorProps {
  subdomainInfo: SubdomainInfo;
}

/**
 * The Smart Door - Decides which world to show
 * 
 * Think of this as a smart receptionist that:
 * 1. Looks at where you're trying to go
 * 2. Figures out what you want to see
 * 3. Sends you to the right "world"
 */
export const SmartDoor: React.FC<SmartDoorProps> = ({ subdomainInfo }) => {
  console.log('🚪 SmartDoor received subdomainInfo:', subdomainInfo);
  
  // 🚪 DECISION 1: Is this water refill?
  if (subdomainInfo.isWaterRefill) {
    console.log('✅ Routing to WaterRefillWorld');
    return <WaterRefillWorld subdomainInfo={subdomainInfo} />;
  }
  
  // 🚪 DECISION 2: Is this senior care?
  if (subdomainInfo.isSeniorCare) {
    console.log('✅ Routing to SeniorCareWorld');
    return <SeniorCareWorld subdomainInfo={subdomainInfo} />;
  }
  
  // 🚪 DECISION 3: Is this specialty pet?
  if (subdomainInfo.isSpecialtyPet) {
    console.log('✅ Routing to SpecialtyPetWorld');
    return <SpecialtyPetWorld subdomainInfo={subdomainInfo} />;
  }
  
  // 🚪 DECISION 4: Is this the general services page?
  if (subdomainInfo.isServices) {
    console.log('✅ Routing to ServicesWorld');
    return <ServicesWorld subdomainInfo={subdomainInfo} />;
  }
  
  // 🚪 DECISION 5: Default - Regular business directory
  console.log('✅ Routing to BusinessWorld (default)');
  return <BusinessWorld subdomainInfo={subdomainInfo} />;
};

export default SmartDoor;
