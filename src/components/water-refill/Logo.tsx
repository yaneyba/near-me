import React from 'react';
import { Droplets } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'text-only';
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  theme = 'light',
  className = '',
  onClick 
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      subtitle: 'text-xs',
      gap: 'gap-2'
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      subtitle: 'text-sm',
      gap: 'gap-3'
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-2xl',
      subtitle: 'text-base',
      gap: 'gap-3'
    },
    xl: {
      icon: 'w-12 h-12',
      text: 'text-3xl',
      subtitle: 'text-lg',
      gap: 'gap-4'
    }
  };

  const config = sizeConfig[size];
  const isClickable = !!onClick;

  // Theme-based color configuration
  const themeColors = {
    light: {
      icon: 'text-blue-500',
      iconFill: 'fill-current',
      droplet: 'bg-blue-300',
      title: 'text-gray-900',
      subtitle: 'text-blue-600'
    },
    dark: {
      icon: 'text-blue-200',
      iconFill: 'fill-current',
      droplet: 'bg-blue-400',
      title: 'text-white',
      subtitle: 'text-blue-200'
    }
  };

  const colors = themeColors[theme];

  const LogoContent = () => (
    <>
      {/* Icon */}
      {(variant === 'full' || variant === 'icon-only') && (
        <div className="relative">
          <Droplets className={`${config.icon} ${colors.icon} ${colors.iconFill}`} />
          {/* Water droplet effect */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.droplet} rounded-full opacity-70 animate-pulse`}></div>
        </div>
      )}

      {/* Text */}
      {(variant === 'full' || variant === 'text-only') && (
        <div className="flex flex-col">
          <h1 className={`${config.text} font-bold ${colors.title} leading-tight`}>
            AquaFinder
          </h1>
          <p className={`${config.subtitle} ${colors.subtitle} font-medium leading-tight`}>
            Find Water Stations
          </p>
        </div>
      )}
    </>
  );

  const baseClasses = `flex items-center ${config.gap} ${className}`;
  const interactiveClasses = isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  if (isClickable) {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses}`}
        aria-label="AquaFinder - Find Water Stations"
      >
        <LogoContent />
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      <LogoContent />
    </div>
  );
};

export default Logo;
