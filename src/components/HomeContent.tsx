import React from 'react';
import { ChevronRight, Star, ArrowRight } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  reviewCount?: number;
  onDetailsClick?: () => void;
  onParticipateClick?: () => void;
  startDate?: string;
  type?: string;
  gradient?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  reviewCount,
  onDetailsClick,
  onParticipateClick,
  startDate,
  type,
  gradient = 'from-blue-600 to-blue-800'
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
      
      {reviewCount && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-0.5">
          <Star size={14} className="text-yellow-400 flex-shrink-0" />
          <span className="text-white text-xs">{reviewCount}+ отзывов</span>
        </div>
      )}
      
      {startDate && type && (
        <div className="mb-3">
          <span className="text-emerald-300 text-xs font-medium">Старт {startDate}</span>
          <h3 className="text-white/90 font-medium text-sm mt-0.5">{type}</h3>
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-white mb-4 pr-16">{title}</h3>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {onParticipateClick && (
          <button
            onClick={onParticipateClick}
            className="w-full sm:flex-1 bg-white text-gray-900 rounded-xl py-2.5 px-4 font-medium 
                     hover:bg-gray-100 transition-colors text-sm flex items-center justify-center"
          >
            Принять участие
          </button>
        )}
        
        <button
          onClick={onDetailsClick}
          className="w-full sm:flex-1 bg-black/20 backdrop-blur-sm text-white rounded-xl py-2.5 px-4 
                   font-medium hover:bg-black/30 transition-colors text-sm flex items-center justify-center"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export function HomeContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Начни свой путь с этого</h2>
        <ProgramCard
          title="Денежная медитация"
          startDate="28.02"
          type="Челлендж 28 дней"
          gradient="from-emerald-600 to-emerald-900"
          onDetailsClick={() => {}}
          onParticipateClick={() => {}}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Выбери актуальное</h2>
        <div className="space-y-3">
          <ProgramCard
            title="Практика активации шишковидной железы"
            reviewCount={500}
            gradient="from-purple-600 to-purple-900"
            onDetailsClick={() => {}}
          />
          <ProgramCard
            title="Создай стратегию лучшей жизни на 3 года"
            reviewCount={300}
            gradient="from-blue-600 to-indigo-900"
            onDetailsClick={() => {}}
          />
        </div>
      </section>

      <section>
        <button className="w-full bg-[#2A2A2A] text-white rounded-xl py-3.5 px-4 font-medium 
                        hover:bg-[#353535] transition-colors flex items-center justify-center space-x-2 
                        text-sm group">
          <span>Смотреть все курсы</span>
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Открой доступ ко всем программам</h2>
        <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-2">AURA Premium</h3>
            <p className="text-white/80 text-sm mb-4 max-w-md">
              Получи доступ ко всем медитациям, программам и челленджам для достижения максимальных результатов
            </p>
            <button className="w-full sm:w-auto bg-white text-gray-900 rounded-xl py-3 px-6 
                           font-semibold hover:bg-gray-100 transition-colors text-sm 
                           flex items-center justify-center">
              Узнать подробнее
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}