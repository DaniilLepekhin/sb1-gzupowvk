import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Home, BookOpen, Grid, Headset } from 'lucide-react';
import { streamChatCompletion, loadChatHistory, saveChatHistory, transcribeAudio } from '../lib/openai';
import { VoiceRecorder } from './VoiceRecorder';
import { NavButton } from './NavButton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  onNavigate?: (tab: string) => void;
}

export function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => loadChatHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let currentResponse = '';
    const assistantMessage = { role: 'assistant' as const, content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      await streamChatCompletion([...messages, userMessage], (chunk) => {
        currentResponse += chunk;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...assistantMessage, content: currentResponse }
        ]);
      });
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { 
          role: 'assistant', 
          content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    setError(null);

    try {
      const transcription = await transcribeAudio(audioBlob);
      setInput(transcription);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error processing voice:', error);
      setError('Не удалось обработать голосовое сообщение');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const handleHelpClick = () => {
    window.open('https://t.me/probudis_zabota', '_blank');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1f1f1f]">
      {/* Header */}
      <div className="bg-[#2A2A2A] border-b border-gray-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-medium text-white">AI Ассистент</h1>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-32"
        style={{ 
          height: 'calc(100vh - 8.5rem)',
          paddingBottom: 'calc(8rem + env(safe-area-inset-bottom))'
        }}
      >
        <div className="max-w-2xl mx-auto py-4 space-y-3">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-400 text-sm px-6 text-center">
                Задайте любой вопрос, и я постараюсь помочь вам найти ответ
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#2A2A2A] text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-[#1f1f1f] border-t border-gray-800/50 p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <button
              type="button"
              onClick={clearHistory}
              className="px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 
                       transition-colors flex items-center justify-center"
              title="Очистить историю"
            >
              <Trash2 size={18} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              rows={1}
              className="flex-1 px-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                       focus:border-transparent transition-all text-[13px] resize-none overflow-hidden
                       min-h-[42px] max-h-32"
              disabled={isLoading}
              style={{ lineHeight: '1.5' }}
            />
            <VoiceRecorder 
              onRecordingComplete={handleVoiceRecording}
              isProcessing={isProcessingVoice}
              onTranscriptionStart={() => setInput('Расшифровка аудио...')}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl bg-blue-600 text-white flex items-center justify-center
                         min-w-[48px] transition-all ${
                           isLoading 
                             ? 'opacity-50 cursor-not-allowed' 
                             : 'hover:bg-blue-700 active:scale-95'
                         }`}
            >
              <Send size={18} className={isLoading ? 'opacity-50' : ''} />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-center items-center h-16">
          <div className="grid grid-cols-4 w-full max-w-[320px]">
            <NavButton
              icon={<Headset size={20} />}
              label="Помощь"
              onClick={handleHelpClick}
            />
            <NavButton
              icon={<Home size={20} />}
              label="Главная"
              onClick={() => onNavigate?.('home')}
            />
            <NavButton
              icon={<BookOpen size={20} />}
              label="Курсы"
              onClick={() => onNavigate?.('courses')}
            />
            <NavButton
              icon={<Grid size={20} />}
              label="Ещё"
              onClick={() => onNavigate?.('more')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}