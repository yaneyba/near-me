import React, { useState, useEffect } from 'react';
import { Download, FileText, Globe, MapPin, Building, Users } from 'lucide-react';
import { sitemapGenerator } from '@/utils/sitemapGenerator';

const SitemapGenerator: React.FC = () => {
  const [sitemaps, setSitemaps] = useState<Record<string, string>>({});
  const [sitemapData, setSitemapData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSitemap, setSelectedSitemap] = useState<string>('');

  useEffect(() => {
    // Load sitemap data on component mount
    const data = sitemapGenerator.getSitemapData();
    setSitemapData(data);
  }, []);

  const handleGenerateSitemaps = async () => {
    setIsGenerating(true);
    try {
      // Simulate generation time for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const generatedSitemaps = sitemapGenerator.generateAllSitemaps();
      setSitemaps(generatedSitemaps);
      setSelectedSitemap('sitemap.xml');
    } catch (error) {
      console.error('Error generating sitemaps:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    Object.entries(sitemaps).forEach(([filename, content]) => {
      setTimeout(() => {
        handleDownloadSitemap(filename, content);
      }, 100);
    });
  };

  const getSitemapStats = () => {
    if (!sitemapData) return null;

    const totalUrls = sitemapData.combinations.length * 4 + // Main pages per combination
                     sitemapData.businesses.length + // Business pages
                     sitemapData.categories.length + // Category pages
                     sitemapData.cities.length; // City pages

    return {
      totalUrls,
      combinations: sitemapData.combinations.length,
      businesses: sitemapData.businesses.length,
      categories: sitemapData.categories.length,
      cities: sitemapData.cities.length
    };
  };

  const stats = getSitemapStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-blue-600" />
                SEO Sitemap Generator
              </h1>
              <p className="text-gray-600 mt-2">
                Generate comprehensive XML sitemaps for the dynamic subdomain system
              </p>
            </div>
            <button
              onClick={handleGenerateSitemaps}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Sitemaps
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sitemap Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalUrls}</div>
                <div className="text-sm text-gray-600">Total URLs</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.combinations}</div>
                <div className="text-sm text-gray-600">Combinations</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.businesses}</div>
                <div className="text-sm text-gray-600">Businesses</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <MapPin className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.cities}</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Sitemaps */}
        {Object.keys(sitemaps).length > 0 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Sitemaps</h2>
              <button
                onClick={handleDownloadAll}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sitemap List */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Available Sitemaps</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Object.entries(sitemaps).map(([filename, content]) => (
                    <div
                      key={filename}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSitemap === filename
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSitemap(filename)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="font-medium text-gray-900">{filename}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {Math.round(content.length / 1024)}KB
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSitemap(filename, content);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sitemap Preview */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  Preview: {selectedSitemap || 'Select a sitemap'}
                </h3>
                {selectedSitemap && sitemaps[selectedSitemap] && (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    <pre>{sitemaps[selectedSitemap]}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Instructions</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
              <div>
                <strong>Upload to Root Domain:</strong> Place the main sitemap.xml and robots.txt in your root domain (near-me.us)
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
              <div>
                <strong>Subdomain Sitemaps:</strong> Upload category-city specific sitemaps to their respective subdomains
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
              <div>
                <strong>Submit to Search Engines:</strong> Submit sitemaps to Google Search Console and Bing Webmaster Tools
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
              <div>
                <strong>Monitor Performance:</strong> Track indexation rates and crawl frequency in webmaster tools
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapGenerator;