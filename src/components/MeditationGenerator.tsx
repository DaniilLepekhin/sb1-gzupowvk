import React, { useState } from 'react';
import { generateMeditation } from '../lib/meditation';
import { Loader2, Sparkles } from 'lucide-react';

export function MeditationGenerator() {
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [meditation, setMeditation] = useState<{
    text: string;
    audioUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!theme.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateMeditation(theme);
      setMeditation(result);
    } catch (err) {
      console.error('Error generating meditation:', err);
      setError('Произошла ошибка при генерации медитации');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">AI Генератор Медитаций</h2>
        <p className="text-gray-400 text-sm">
          Введите тему для медитации, и AI создаст персонализированную медитацию с голосовым сопровождением
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Например: Внутренний покой"
          className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !theme.trim()}
          className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2
                     ${isGenerating 
                       ? 'bg-blue-600/50 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700 active:scale-99'
                     } text-white transition-all`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Генерация медитации...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Создать медитацию</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {meditation && (
        <div className="space-y-4">
          <div className="p-4 bg-[#2A2A2A] rounded-xl">
            <h3 className="text-lg font-medium text-white mb-3">Текст медитации</h3>
            <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {meditation.text}
            </p>
          </div>

          <div className="p-4 bg-[#2A2A2A] rounded-xl">
            <h3 className="text-lg font-medium text-white mb-3">Аудио медитация</h3>
            <audio 
              controls 
              className="w-full" 
              src={meditation.audioUrl}
              controlsList="nodownload"
            >
              Ваш браузер не поддерживает аудио элемент.
            </audio>
          </div>
        </div>
      )}
    </div>
  );
}