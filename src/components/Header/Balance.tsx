import React from 'react';

export function Balance() {
  return (
    <div className="absolute top-16 right-4">
      <div className="text-white font-medium text-xs">
        <span className="text-gray-400 mr-1">Баланс:</span>
        <span>0 ₽</span>
      </div>
    </div>
  );
}