import { IDataProvider } from '@/types';
import { JsonDataProvider } from '@/providers/JsonDataProvider';
import { D1DataProvider } from '@/providers/D1DataProvider';

export type DataProviderType = 'json' | 'api' | 'mock' | 'd1';

export interface DataProviderConfig {
  type: DataProviderType;
  apiBaseUrl?: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;
  private static config: DataProviderConfig = {
    type: 'd1' // Default to D1 provider (Cloudflare D1 database)
  };

  /**
   * Configure the data provider factory
   */
  static configure(config: Partial<DataProviderConfig>): void {
    this.config = { ...this.config, ...config };
    // Reset instance to force recreation with new config
    this.instance = null;
  }

  /**
   * Get the data provider instance based on configuration
   */
  static getInstance(): IDataProvider {
    if (!this.instance) {
      this.instance = this.createProvider();
    }
    return this.instance;
  }

  /**
   * Convenience method to get the configured data provider
   */
  static getProvider(): IDataProvider {
    return this.getInstance();
  }

  /**
   * Create a new provider instance (useful for testing)
   */
  static createProvider(config?: DataProviderConfig): IDataProvider {
    const providerConfig = config || this.config;
    
    switch (providerConfig.type) {
      case 'json':
        return new JsonDataProvider();
      
      case 'd1':
        return new D1DataProvider();
      
      case 'api':
        // In the future, this would create an API-based provider
        throw new Error('API provider not yet implemented. Use D1DataProvider for now.');
      
      case 'mock':
        // In the future, this would create a mock provider for testing
        throw new Error('Mock provider not yet implemented. Use JsonDataProvider for now.');
      
      default:
        throw new Error(`Unknown provider type: ${providerConfig.type}`);
    }
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Get current configuration
   */
  static getConfig(): DataProviderConfig {
    return { ...this.config };
  }

  /**
   * Check if provider is initialized
   */
  static isInitialized(): boolean {
    return this.instance !== null;
  }
}