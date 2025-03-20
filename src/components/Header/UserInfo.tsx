import React from 'react';
import { useTelegramUser } from '../../hooks/useTelegramUser';

export function UserInfo() {
  const user = useTelegramUser();

  return (
    <div className="absolute top-20 left-4">
      <div className="flex items-center space-x-2.5 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/5">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-800 border border-white/10">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-base">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <span className="text-white font-medium text-base pr-2">
          {user?.name || 'Пользователь'}
        </span>
      </div>
    </div>
  );
}