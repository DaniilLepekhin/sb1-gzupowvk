import React from 'react';
import { ArrowLeft, ArrowRight, List, Eye, FileDown } from 'lucide-react';
import { useTelegramUser } from '../hooks/useTelegramUser';

interface CourseLessonProps {
  title: string;
  content?: string;
  welcomeContent?: string;
  courseInfo?: string;
  dayNumber: number;
  totalDays: number;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  audioUrl?: string;
  additionalContent?: string;
  giftContent?: string;
  streamLink?: string;
  videoUrl?: string;
  pdfUrl?: string;
  meditationGuide?: string;
}

export function CourseLesson({ 
  title, 
  content,
  welcomeContent,
  courseInfo,
  dayNumber, 
  totalDays,
  onBack,
  onNext,
  onPrevious,
  audioUrl,
  additionalContent,
  giftContent,
  streamLink,
  videoUrl,
  pdfUrl,
  meditationGuide
}: CourseLessonProps) {
  const user = useTelegramUser();
  
  // Replace placeholder with actual username
  const processedWelcome = welcomeContent?.replace('#{name}', user?.name || 'Пользователь');
  const processedCourseInfo = courseInfo?.replace('#{name}', user?.name || 'Пользователь');
  const processedGiftContent = giftContent?.replace('#{name}', user?.name || 'Пользователь');
  const processedAdditionalContent = additionalContent?.replace('#{name}', user?.name || 'Пользователь');
  const processedContent = content?.replace('#{name}', user?.name || 'Пользователь');
  const processedMeditationGuide = meditationGuide?.replace('#{name}', user?.name || 'Пользователь');

  // Convert Telegram usernames to links and maintain line breaks
  const contentWithLinks = processedContent
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  const welcomeWithLinks = processedWelcome
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  const courseInfoWithLinks = processedCourseInfo
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  const giftContentWithLinks = processedGiftContent
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  const additionalContentWithLinks = processedAdditionalContent
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  const meditationGuideWithLinks = processedMeditationGuide
    ?.split('\n')
    .map(line => 
      line.replace(
        /@(\w+)/g,
        '<a href="https://t.me/$1" target="_blank" class="text-blue-400 hover:text-blue-300">@$1</a>'
      )
    )
    .join('<br />');

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  // Get audio title based on the URL
  const getAudioTitle = (url: string) => {
    if (url.includes('Активирующая_медитация')) {
      return 'Активирующая Медитация "Глаз Бога"';
    }
    if (url.includes('Обновление_Программ')) {
      return 'Обновление программ';
    }
    if (url.includes('Дыхание_Творца')) {
      return 'Дыхание творца';
    }
    if (url.includes('Гипноз___За_Пределами_Ума')) {
      return 'Гипноз "За пределами Ума"';
    }
    return 'Аудио';
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] pb-24 w-full">
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
      <div className="relative -mt-8 w-full">
        <div className="bg-[#1f1f1f] rounded-t-[32px] px-4 pt-8 w-full">
          <div className="max-w-3xl mx-auto w-full">
            <div className="mb-6 w-full">
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            </div>

            <div className="prose prose-invert max-w-none w-full">
              {/* Welcome Content */}
              {welcomeWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 w-full"
                  dangerouslySetInnerHTML={{ __html: welcomeWithLinks }}
                />
              )}
              
              {/* Chat Button after Welcome */}
              {welcomeContent && (
                <div className="mt-8 mb-8 w-full">
                  <a
                    href="https://t.me/+VAMEMbSn2Io0OTMy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Общий чат 💭
                  </a>
                </div>
              )}

              {/* Course Info */}
              {courseInfoWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 mt-8 w-full"
                  dangerouslySetInnerHTML={{ __html: courseInfoWithLinks }}
                />
              )}

              {/* Main Content */}
              {contentWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 mt-8 w-full"
                  dangerouslySetInnerHTML={{ __html: contentWithLinks }}
                />
              )}

              {/* Stream Link Button */}
              {streamLink && (
                <div className="mt-8 mb-8 w-full">
                  <a
                    href={streamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors space-x-2"
                  >
                    <Eye size={20} />
                    <span>СМОТРЕТЬ ЭФИР</span>
                  </a>
                </div>
              )}

              {/* Video Embed */}
              {videoUrl && (
                <div className="mt-8 mb-8 aspect-video w-full">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* PDF Download Button */}
              {pdfUrl && (
                <div className="mt-8 mb-8 w-full">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors space-x-2"
                    download
                  >
                    <FileDown size={20} />
                    <span>Скачать PDF</span>
                  </a>
                </div>
              )}

              {/* Meditation Guide */}
              {meditationGuideWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 mt-8 w-full"
                  dangerouslySetInnerHTML={{ __html: meditationGuideWithLinks }}
                />
              )}

              {/* Gift Content */}
              {giftContentWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 mt-8 w-full"
                  dangerouslySetInnerHTML={{ __html: giftContentWithLinks }}
                />
              )}

              {/* Additional Content */}
              {additionalContentWithLinks && (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4 mt-8 w-full"
                  dangerouslySetInnerHTML={{ __html: additionalContentWithLinks }}
                />
              )}

              {/* Audio Player */}
              {audioUrl && (
                <div className="my-8 p-4 bg-[#2A2A2A] rounded-lg w-full">
                  <div className="text-white mb-2 px-2">{getAudioTitle(audioUrl)}</div>
                  <audio 
                    controls 
                    className="w-full" 
                    controlsList="nodownload"
                    preload="metadata"
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    Ваш браузер не поддерживает аудио элемент.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#2A2A2A] border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between items-center h-16 max-w-[280px] mx-auto">
          <button
            onClick={onPrevious}
            disabled={dayNumber === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              dayNumber === 1 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-white hover:bg-[#353535]'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Пред.</span>
          </button>

          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center px-4 py-2 text-white hover:bg-[#353535] rounded-lg transition-colors"
          >
            <List size={20} />
            <span className="text-xs mt-1">Список</span>
          </button>

          <button
            onClick={onNext}
            disabled={dayNumber === totalDays}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              dayNumber === totalDays
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-[#353535]'
            }`}
          >
            <span>След.</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}