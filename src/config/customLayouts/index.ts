/**
 * Custom Layout Configurations
 * 
 * This module exports all available custom layout configurations
 * for different business categories.
 */

import { waterRefillConfig } from './waterRefillConfig';
import { evChargingConfig } from './evChargingConfig';
import { foodDeliveryConfig } from './foodDeliveryConfig';

export { waterRefillConfig } from './waterRefillConfig';
export { evChargingConfig } from './evChargingConfig';
export { foodDeliveryConfig } from './foodDeliveryConfig';

// Type for accessing configurations
export type CustomLayoutKey = 'water-refill' | 'ev-charging' | 'food-delivery';

// Registry for easy access to configurations
export const customLayoutConfigs = {
  'water-refill': waterRefillConfig,
  'ev-charging': evChargingConfig,
  'food-delivery': foodDeliveryConfig
} as const;
