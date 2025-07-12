import React from 'react';
import { Star } from 'lucide-react';

interface StarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
  reviewCount?: number;
}

const Stars: React.FC<StarsProps> = ({ 
  rating, 
  size = 'md', 
  showRating = false, 
  reviewCount 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showRating && (
        <>
          <span className="ml-2 font-medium">{rating}</span>
          {reviewCount !== undefined && (
            <span className="ml-1">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
          )}
        </>
      )}
    </div>
  );
};

export default Stars;
