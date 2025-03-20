import React, { useState, useEffect, useCallback } from 'react';
import { MaterialsTabs } from './MaterialsTabs';
import { CourseCard } from './CourseCard';
import { supabase } from '../lib/supabase';
import { useTelegramUser } from '../hooks/useTelegramUser';
import { AlertTriangle, CheckCircle, Info, Copy, Check, RefreshCw } from 'lucide-react';
import { AuthService } from '../lib/auth';

interface Course {
  id: string;
  title: string;
  description: string;
  course_days: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

interface CoursesContentProps {
  onCourseSelect: (courseId: string) => void;
}

export function CoursesContent({ onCourseSelect }: CoursesContentProps) {
  const [activeTab, setActiveTab] = useState('free');
  const user = useTelegramUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadInitialData = useCallback(async () => {
    if (!user?.id) {
      console.warn('No user ID available for data loading');
      setIsLoading(false);
      setDebugInfo(prev => ({
        ...prev,
        error: 'No user ID available',
        user: null,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    try {
      console.group(`Loading Courses Data (Attempt ${loadAttempts + 1})`);
      console.log('User:', { id: user.id, name: user.name });
      
      setIsLoading(true);
      setLastError(null);

      // Log WebApp state
      const tg = window.Telegram?.WebApp;
      console.log('WebApp State:', {
        platform: tg?.platform,
        version: tg?.version,
        viewportHeight: tg?.viewportHeight,
        viewportStableHeight: tg?.viewportStableHeight
      });

      // Ensure we have a valid session
      console.log('Refreshing session...');
      const session = await AuthService.refreshSession();
      if (!session) {
        throw new Error('No valid session after refresh');
      }
      console.log('Session refreshed successfully:', {
        userId: session.user.id,
        expiresAt: session.expires_at
      });

      // Load courses
      console.log('Loading courses...');
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          course_days (
            id,
            title,
            content
          )
        `)
        .order('created_at', { ascending: true });

      if (coursesError) {
        console.error('Error loading courses:', coursesError);
        throw coursesError;
      }
      console.log('Courses loaded:', coursesData?.length || 0);
      setCourses(coursesData || []);

      // Load favorites
      console.log('Loading favorites...');
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('telegram_favorites')
        .select('course_id')
        .eq('telegram_id', user.id);

      if (favoritesError) {
        console.error('Error loading favorites:', favoritesError);
        throw favoritesError;
      }
      console.log('Favorites loaded:', favoritesData?.length || 0);
      setFavorites(favoritesData?.map(f => f.course_id) || []);

      // Load progress
      console.log('Loading course progress...');
      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('course_id, current_day')
        .eq('user_id', session.user.id);

      if (progressError) {
        console.error('Error loading progress:', progressError);
        throw progressError;
      }
      
      const progress = progressData?.reduce((acc, item) => ({
        ...acc,
        [item.course_id]: item.current_day
      }), {}) || {};
      console.log('Progress loaded:', Object.keys(progress).length);
      setCourseProgress(progress);

      setLastAction('Data loaded successfully');
      setDebugInfo({
        timestamp: new Date().toISOString(),
        loadAttempt: loadAttempts + 1,
        user: {
          id: user.id,
          name: user.name,
          platform: tg?.platform,
          version: tg?.version
        },
        session: {
          id: session.user.id,
          expires_at: session.expires_at
        },
        data: {
          courses: coursesData?.length || 0,
          favorites: favoritesData?.length || 0,
          progress: Object.keys(progress).length
        },
        webApp: {
          platform: tg?.platform,
          version: tg?.version,
          viewportHeight: tg?.viewportHeight,
          viewportStableHeight: tg?.viewportStableHeight,
          colorScheme: tg?.colorScheme,
          themeParams: tg?.themeParams
        }
      });

      console.log('Data loading completed successfully');
      console.groupEnd();

    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setLastError(errorMessage);
      setDebugInfo(prev => ({
        ...prev,
        error: errorMessage,
        errorTimestamp: new Date().toISOString(),
        loadAttempt: loadAttempts + 1,
        errorDetails: error
      }));

      // Retry loading if we haven't exceeded max attempts
      if (loadAttempts < AuthService.MAX_RETRIES) {
        console.log(`Retrying data load (attempt ${loadAttempts + 1})`);
        setLoadAttempts(prev => prev + 1);
        setTimeout(loadInitialData, 1000 * (loadAttempts + 1));
      }

      console.groupEnd();
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, loadAttempts]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setLoadAttempts(0);
    try {
      await AuthService.signOut();
      if (user?.id) {
        await AuthService.signIn(user.id);
      }
      await loadInitialData();
      setLastAction('Session refreshed successfully');
    } catch (error) {
      setLastError('Failed to refresh session');
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleFavorite = async (courseId: string) => {
    if (!user?.id || isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    setLastError(null);
    
    try {
      console.group('Toggle Favorite');
      console.log('User:', user.id);
      console.log('Course:', courseId);
      
      const isFavorite = favorites.includes(courseId);
      console.log('Current favorite status:', isFavorite);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('telegram_favorites')
          .delete()
          .eq('telegram_id', user.id)
          .eq('course_id', courseId);

        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== courseId));
        setLastAction('Removed from favorites');
        console.log('Successfully removed from favorites');
      } else {
        const { error } = await supabase
          .from('telegram_favorites')
          .insert({ 
            telegram_id: user.id,
            course_id: courseId 
          });

        if (error) throw error;
        
        setFavorites(prev => [...prev, courseId]);
        setLastAction('Added to favorites');
        console.log('Successfully added to favorites');
      }

      setDebugInfo(prev => ({
        ...prev,
        lastFavoriteAction: {
          type: isFavorite ? 'remove' : 'add',
          courseId,
          userId: user.id,
          timestamp: new Date().toISOString()
        }
      }));

    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update favorite';
      setLastError(errorMessage);
      setDebugInfo(prev => ({
        ...prev,
        lastError: {
          message: errorMessage,
          error: error,
          timestamp: new Date().toISOString()
        }
      }));
      await loadInitialData();
    } finally {
      setIsFavoriteLoading(false);
      console.groupEnd();
    }
  };

  const copyDebugInfo = async () => {
    try {
      const debugText = JSON.stringify(debugInfo, null, 2);
      await navigator.clipboard.writeText(debugText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy debug info:', error);
      setLastError('Failed to copy debug info to clipboard');
    }
  };

  const renderCourseCard = (course: Course) => (
    <CourseCard
      key={course.id}
      title={course.title}
      description={course.description}
      currentDay={courseProgress[course.id] || 1}
      totalDays={course.course_days?.length || 0}
      isFavorite={favorites.includes(course.id)}
      onFavoriteClick={() => toggleFavorite(course.id)}
      onClick={() => onCourseSelect(course.id)}
      isLoading={isFavoriteLoading}
    />
  );

  const LoadingSkeleton = () => (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
           style={{ backgroundSize: '200% 100%' }} />
      
      <div className="relative space-y-4">
        <div className="pl-4">
          <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded-lg w-full" />
            <div className="h-4 bg-white/10 rounded-lg w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );

  const DebugPanel = () => (
    <div className="fixed bottom-20 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 z-50 max-h-[60vh] overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Info size={16} /> Debug Info
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className={`text-white/60 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Session'}</span>
            </button>
            <button 
              onClick={copyDebugInfo}
              className="text-white/60 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg"
            >
              {isCopied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Debug Info</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-white/60 hover:text-white px-3 py-1.5"
            >
              Hide
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">Platform</div>
            <div className="text-white">{window.Telegram?.WebApp?.platform || 'Unknown'}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">WebApp Version</div>
            <div className="text-white">{window.Telegram?.WebApp?.version || 'Unknown'}</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 mb-2">User Info</div>
          <div className="text-white text-sm space-y-1">
            <div>ID: {user?.id || 'Not available'}</div>
            <div>Name: {user?.name || 'Not available'}</div>
            <div>Load Attempts: {loadAttempts}</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 mb-2">Data Stats</div>
          <div className="text-white text-sm space-y-1">
            <div>Courses: {courses.length}</div>
            <div>Favorites: {favorites.length}</div>
            <div>Progress Items: {Object.keys(courseProgress).length}</div>
            <div>Session: {debugInfo.session ? 'Active' : 'None'}</div>
          </div>
        </div>

        {debugInfo.webApp && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-2">WebApp Details</div>
            <div className="text-white text-sm space-y-1">
              <div>Platform: {debugInfo.webApp.platform}</div>
              <div>Version: {debugInfo.webApp.version}</div>
              <div>Color Scheme: {debugInfo.webApp.colorScheme}</div>
              <div>Viewport Height: {debugInfo.webApp.viewportHeight}</div>
              <div>Stable Height: {debugInfo.webApp.viewportStableHeight}</div>
            </div>
          </div>
        )}

        {lastAction && (
          <div className="bg-green-900/20 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <div className="text-green-400 text-sm font-medium">Last Action</div>
              <div className="text-green-300 text-sm">{lastAction}</div>
            </div>
          </div>
        )}

        {lastError && (
          <div className="bg-red-900/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-400 mt-1 flex-shrink-0" />
            <div>
              <div className="text-red-400 text-sm font-medium">Error</div>
              <div className="text-red-300 text-sm">{lastError}</div>
            </div>
          </div>
        )}

        <div className="text-white/40 text-xs text-center">
          Last updated: {new Date(debugInfo.timestamp || Date.now()).toLocaleString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Обучающие материалы</h2>
      <MaterialsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === 'my' && courses.filter(course => favorites.includes(course.id)).map(renderCourseCard)}
            {activeTab === 'free' && courses.map(renderCourseCard)}
          </>
        )}
      </div>

      {showDebug && <DebugPanel />}

      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          className="fixed bottom-20 right-4 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm z-50"
        >
          Show Debug
        </button>
      )}
    </div>
  );
}