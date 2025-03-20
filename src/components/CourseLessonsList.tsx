import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface CourseLessonsListProps {
  title: string;
  description: string;
  days: Array<{
    id: string;
    title: string;
  }>;
  onLessonSelect: (dayNumber: number) => void;
  onBack: () => void;
}

export function CourseLessonsList({ 
  title, 
  description,
  days,
  onLessonSelect,
  onBack
}: CourseLessonsListProps) {
  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      {/* Header with background image - reduced height */}
      <div className="relative w-full h-[14vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2848&auto=format&fit=crop")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-8">
        <div className="bg-[#1f1f1f] min-h-[86vh] rounded-t-[32px] px-4 pt-8 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-400">{description}</p>
            </div>

            <div className="space-y-4">
              {days.map((day, index) => (
                <button
                  key={day.id}
                  onClick={() => onLessonSelect(index + 1)}
                  className="w-full bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between group hover:bg-[#353535] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <span className="text-white text-left">{day.title}</span>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2A2A2A] border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-center items-center h-16">
          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center px-6 py-2 text-white hover:text-gray-300 transition-colors"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Главная</span>
          </button>
        </div>
      </div>
    </div>
  );
}