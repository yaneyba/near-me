import React, { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface AdUnitProps {
  slot: string;
  size: 'banner' | 'rectangle' | 'leaderboard' | 'sidebar' | 'mobile-banner';
  className?: string;
  label?: string;
  responsive?: boolean;
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  size, 
  className = '', 
  label = 'Advertisement',
  responsive = true 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  // Check if ads are enabled
  const adsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true';
  const adsProvider = import.meta.env.VITE_ADS_PROVIDER || 'google';
  const clientId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;

  // Size configurations
  const sizeConfig = {
    banner: { width: 728, height: 90 },
    rectangle: { width: 300, height: 250 },
    leaderboard: { width: 728, height: 90 },
    sidebar: { width: 300, height: 600 },
    'mobile-banner': { width: 320, height: 50 }
  };

  const currentSize = sizeConfig[size];

  useEffect(() => {
    if (!adsEnabled || !clientId || !adRef.current) return;

    // Load Google AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        initializeAd();
      };
      document.head.appendChild(script);
    } else {
      initializeAd();
    }

    function initializeAd() {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle as any[]).push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.warn('Ad failed to load:', error);
      }
    }
  }, [adsEnabled, clientId, slot]);

  // Don't render if ads are disabled
  if (!adsEnabled) return null;

  // Don't render if required config is missing
  if (!clientId || !slot) return null;

  // Don't render if user closed the ad
  if (!isVisible) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Ad Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {label}
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="Close ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Ad Container */}
      <div 
        ref={adRef}
        className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative"
        style={{
          minWidth: responsive ? 'auto' : currentSize.width,
          minHeight: responsive ? 'auto' : currentSize.height,
          maxWidth: '100%'
        }}
      >
        {adsProvider === 'google' && (
          <ins
            className="adsbygoogle block"
            style={{
              display: 'block',
              width: responsive ? '100%' : `${currentSize.width}px`,
              height: responsive ? 'auto' : `${currentSize.height}px`
            }}
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format={responsive ? 'auto' : undefined}
            data-full-width-responsive={responsive ? 'true' : undefined}
          />
        )}

        {/* Fallback content while loading */}
        {!isLoaded && (
          <div 
            className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500"
            style={{ 
              width: responsive ? '100%' : currentSize.width,
              height: responsive ? '200px' : currentSize.height 
            }}
          >
            <div className="text-center">
              <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm font-medium">Advertisement</div>
              <div className="text-xs opacity-75">Loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdUnit;