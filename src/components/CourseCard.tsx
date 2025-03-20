import React from 'react';
import { Heart } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  currentDay: number;
  totalDays: number;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onClick: () => void;
  isLoading?: boolean;
}

export function CourseCard({ 
  title, 
  description, 
  isFavorite,
  onFavoriteClick,
  onClick,
  isLoading = false
}: CourseCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoading) {
      // Add a small delay to ensure the event is processed correctly
      setTimeout(() => {
        onFavoriteClick();
      }, 50);
    }
  };

  return (
    <div 
      className="bg-[#2A2A2A] rounded-2xl p-6 relative cursor-pointer touch-manipulation"
      role="button"
      tabIndex={0}
      onClick={onClick}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <button
        onClick={handleFavoriteClick}
        onTouchStart={handleFavoriteClick}
        className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md 
                   ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:bg-black/50'}
                   ${isFavorite ? 'bg-blue-600' : 'bg-black/30'}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isLoading}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'manipulation'
        }}
      >
        <Heart 
          size={20} 
          className={`${isFavorite ? 'fill-white text-white' : 'text-white'}`}
          style={{ pointerEvents: 'none' }}
        />
      </button>

      <div className="flex justify-between items-start mb-4 pl-12">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 truncate">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}