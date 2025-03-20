import React from 'react';

interface MaterialsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MaterialsTabs({ activeTab, onTabChange }: MaterialsTabsProps) {
  const tabs = [
    { id: 'my', label: 'Мои' },
    { id: 'author', label: 'Авторские' },
    { id: 'free', label: 'Бесплатные' },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-6 px-6">
      <div className="inline-flex space-x-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-[12px] transition-all duration-200 border whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-[#424242] hover:border-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}