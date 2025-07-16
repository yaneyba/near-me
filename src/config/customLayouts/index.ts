/**
 * Custom Layout Configurations
 * 
 * This module exports all available custom layout configurations
 * for different business categories.
 */

import { waterRefillConfig } from './waterRefillConfig';
import { evChargingConfig } from './evChargingConfig';
import { foodDeliveryConfig } from './foodDeliveryConfig';
import { seniorCareConfig } from './seniorCareConfig';
import { specialtyPetConfig } from './specialtyPetConfig';

export { waterRefillConfig } from './waterRefillConfig';
export { evChargingConfig } from './evChargingConfig';
export { foodDeliveryConfig } from './foodDeliveryConfig';
export { seniorCareConfig } from './seniorCareConfig';
export { specialtyPetConfig } from './specialtyPetConfig';

// Type for accessing configurations
export type CustomLayoutKey = 'water-refill' | 'ev-charging' | 'food-delivery' | 'senior-care' | 'specialty-pet';

// Registry for easy access to configurations
export const customLayoutConfigs = {
  'water-refill': waterRefillConfig,
  'ev-charging': evChargingConfig,
  'food-delivery': foodDeliveryConfig,
  'senior-care': seniorCareConfig,
  'specialty-pet': specialtyPetConfig
} as const;
