import React from 'react';
import { Headset, Home, Grid, BookOpen } from 'lucide-react';
import { NavButton } from './NavButton';

export function Navigation({ activeTab, onTabChange }: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const handleHelpClick = () => {
    window.open('https://t.me/probudis_zabota', '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-center items-center h-16">
        <div className="grid grid-cols-4 w-full max-w-[320px]">
          <NavButton
            icon={<Headset size={20} />}
            label="Помощь"
            isActive={activeTab === 'help'}
            onClick={handleHelpClick}
          />
          <NavButton
            icon={<Home size={20} />}
            label="Главная"
            isActive={activeTab === 'home'}
            onClick={() => onTabChange('home')}
          />
          <NavButton
            icon={<BookOpen size={20} />}
            label="Курсы"
            isActive={activeTab === 'courses'}
            onClick={() => onTabChange('courses')}
          />
          <NavButton
            icon={<Grid size={20} />}
            label="Ещё"
            isActive={activeTab === 'more'}
            onClick={() => onTabChange('more')}
          />
        </div>
      </div>
    </div>
  );
}