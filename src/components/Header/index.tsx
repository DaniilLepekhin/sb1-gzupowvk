import React from 'react';
import { UserInfo } from './UserInfo';
import { Balance } from './Balance';

export function Header() {
  return (
    <div className="relative w-full h-[28vh]">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2848&auto=format&fit=crop")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
      </div>
      <div className="relative h-full flex items-center justify-center">
        <UserInfo />
        <Balance />
      </div>
    </div>
  );
}