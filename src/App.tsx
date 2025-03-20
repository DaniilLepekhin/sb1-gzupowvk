import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MoreGrid } from './components/MoreGrid';
import { HomeContent } from './components/HomeContent';
import { CoursesContent } from './components/CoursesContent';
import { CourseLesson } from './components/CourseLesson';
import { CourseLessonsList } from './components/CourseLessonsList';
import { supabase } from './lib/supabase';
import { useTelegramUser } from './hooks/useTelegramUser';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState<null | { courseId: string; dayNumber: number }>(null);
  const [showLessonsList, setShowLessonsList] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const user = useTelegramUser();

  useEffect(() => {
    // Add Android-specific body class
    const tg = window.Telegram?.WebApp;
    if (tg?.platform === 'android') {
      document.body.classList.add('android');
    }
  }, []);

  const loadCourseData = async (courseId: string) => {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          course_days (
            id,
            day_number,
            title,
            content,
            welcome_content,
            course_info,
            audio_url,
            video_url,
            pdf_url,
            meditation_guide,
            additional_content,
            gift_content,
            stream_link
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      
      // Sort days by day_number
      if (course.course_days) {
        course.course_days.sort((a: any, b: any) => a.day_number - b.day_number);
      }

      setCurrentCourse(course);
      return course;
    } catch (error) {
      console.error('Error loading course:', error);
      return null;
    }
  };

  const handleLessonSelect = async (courseId: string, dayNumber: number) => {
    const course = await loadCourseData(courseId);
    if (!course) return;

    setSelectedLesson({ courseId, dayNumber });
    setShowLessonsList(false);
    
    if (user?.id) {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      try {
        await supabase
          .from('course_progress')
          .upsert({
            user_id: session.session.user.id,
            course_id: courseId,
            current_day: dayNumber,
            last_accessed: new Date().toISOString()
          }, {
            onConflict: 'user_id,course_id'
          });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
      setShowLessonsList(true);
    } else if (showLessonsList) {
      setShowLessonsList(false);
    }
  };

  const handleNext = async () => {
    if (selectedLesson && currentCourse?.course_days) {
      const nextDay = selectedLesson.dayNumber + 1;
      if (nextDay <= currentCourse.course_days.length) {
        setSelectedLesson({ ...selectedLesson, dayNumber: nextDay });
        
        if (user?.id) {
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) return;

          try {
            await supabase
              .from('course_progress')
              .upsert({
                user_id: session.session.user.id,
                course_id: selectedLesson.courseId,
                current_day: nextDay,
                last_accessed: new Date().toISOString()
              }, {
                onConflict: 'user_id,course_id'
              });
          } catch (error) {
            console.error('Error updating progress:', error);
          }
        }
      }
    }
  };

  const handlePrevious = () => {
    if (selectedLesson && selectedLesson.dayNumber > 1) {
      setSelectedLesson({ ...selectedLesson, dayNumber: selectedLesson.dayNumber - 1 });
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    const course = await loadCourseData(courseId);
    if (!course) return;
    setCurrentCourse(course);
    setShowLessonsList(true);
  };

  if (showLessonsList && currentCourse) {
    return (
      <CourseLessonsList
        title={currentCourse.title}
        description={currentCourse.description}
        days={currentCourse.course_days}
        onLessonSelect={(dayNumber) => handleLessonSelect(currentCourse.id, dayNumber)}
        onBack={() => setShowLessonsList(false)}
      />
    );
  }

  if (selectedLesson && currentCourse) {
    const lesson = currentCourse.course_days.find((day: any) => day.day_number === selectedLesson.dayNumber);
    if (!lesson) return null;

    return (
      <CourseLesson
        title={lesson.title}
        content={lesson.content}
        welcomeContent={lesson.welcome_content}
        courseInfo={lesson.course_info}
        dayNumber={selectedLesson.dayNumber}
        totalDays={currentCourse.course_days.length}
        onBack={handleBack}
        onNext={handleNext}
        onPrevious={handlePrevious}
        audioUrl={lesson.audio_url}
        additionalContent={lesson.additional_content}
        giftContent={lesson.gift_content}
        streamLink={lesson.stream_link}
        videoUrl={lesson.video_url}
        pdfUrl={lesson.pdf_url}
        meditationGuide={lesson.meditation_guide}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] pt-[env(safe-area-inset-top)] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <Header />
      
      <div className="relative h-[72vh]">
        <div className="absolute inset-0 bg-[#1f1f1f] rounded-t-[32px] p-6 overflow-y-auto">
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'courses' && (
            <CoursesContent 
              onCourseSelect={handleCourseSelect}
            />
          )}
          {activeTab === 'more' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Ещё</h2>
              <MoreGrid />
            </div>
          )}
        </div>
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;