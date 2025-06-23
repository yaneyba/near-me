// Export all providers and factory
export { JsonDataProvider } from './JsonDataProvider';
export { DataProviderFactory, type DataProviderType, type DataProviderConfig } from './DataProviderFactory';

// Convenience function to get the configured data provider
export const getDataProvider = () => DataProviderFactory.getInstance();