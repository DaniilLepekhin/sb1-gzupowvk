import React, { useState } from 'react';
import { Book, ShoppingCart, Library, Settings, Heart, User, Bot } from 'lucide-react';
import { Chat } from './Chat';

interface GridItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function GridItem({ icon, label, onClick }: GridItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#353535] transition-colors"
    >
      <div className="text-white mb-2">{icon}</div>
      <span className="text-sm text-white">{label}</span>
    </button>
  );
}

export function MoreGrid() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="fixed inset-0 bg-[#1f1f1f] z-50">
        <Chat onNavigate={() => setShowChat(false)} />
      </div>
    );
  }

  return (
    <div className="relative z-10 grid grid-cols-3 gap-4">
      <GridItem icon={<Book size={24} />} label="Книги" onClick={() => {}} />
      <GridItem icon={<ShoppingCart size={24} />} label="Магазин" onClick={() => {}} />
      <GridItem icon={<Library size={24} />} label="Библиотека" onClick={() => {}} />
      <GridItem icon={<User size={24} />} label="Профиль" onClick={() => {}} />
      <GridItem icon={<Heart size={24} />} label="Избранное" onClick={() => {}} />
      <GridItem icon={<Bot size={24} />} label="AI Чат" onClick={() => setShowChat(true)} />
      <GridItem icon={<Settings size={24} />} label="Настройки" onClick={() => {}} />
    </div>
  );
}