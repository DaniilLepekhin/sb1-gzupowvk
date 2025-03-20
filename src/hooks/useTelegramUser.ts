import { useEffect, useState, useCallback } from 'react';
import { AuthService } from '../lib/auth';
import { checkSession } from '../lib/supabase';

interface TelegramUser {
  id: string;
  name: string;
  avatarUrl?: string;
  debug?: any;
}

// Test user UUID that matches Supabase's UUID format
const TEST_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [debugState, setDebugState] = useState<any>({});
  const [initRetries, setInitRetries] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const waitForTelegramInit = useCallback(async (tg: any): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 50;
    const delay = 100;

    while (attempts < maxAttempts) {
      if (tg.initDataUnsafe?.user?.id || tg.initData) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
    throw new Error('Telegram initialization timeout');
  }, []);

  const getUserData = useCallback(async (tg: any): Promise<any> => {
    try {
      // Wait for Telegram initialization
      await waitForTelegramInit(tg);

      // Try initDataUnsafe first
      if (tg.initDataUnsafe?.user?.id) {
        console.log('Got user data from initDataUnsafe');
        return tg.initDataUnsafe.user;
      }

      // Then try initData
      if (tg.initData) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(tg.initData));
          if (parsedData?.user?.id) {
            console.log('Got user data from parsed initData');
            return parsedData.user;
          }
        } catch (e) {
          console.warn('Failed to parse initData:', e);
        }
      }

      // If in development mode and no data found, return test user
      if (import.meta.env.DEV) {
        console.log('Using test user data in development mode');
        return {
          id: TEST_USER_ID,
          first_name: 'Test',
          last_name: 'User'
        };
      }

      throw new Error('No valid user data found');
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }, [waitForTelegramInit]);

  const initializeTelegramUser = useCallback(async () => {
    try {
      console.group('Telegram User Initialization');
      setIsInitializing(true);

      // Development mode handling
      if (import.meta.env.DEV && !window.Telegram?.WebApp) {
        console.log('Running in development mode');
        const mockUser = {
          id: TEST_USER_ID,
          name: 'Test User',
          avatarUrl: undefined
        };

        await AuthService.signIn(TEST_USER_ID);
        setUser(mockUser);
        setDebugState(prev => ({
          ...prev,
          initialization: {
            success: true,
            user: mockUser,
            mode: 'development',
            timestamp: new Date().toISOString()
          }
        }));
        return true;
      }

      // Production mode handling
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram WebApp not available');
      }

      // Initialize WebApp
      try {
        tg.ready();
        tg.expand();

        // Configure WebApp if version supports it
        if (parseFloat(tg.version) >= 6.2) {
          await tg.enableClosingConfirmation();
          await tg.requestFullscreen();
          tg.setHeaderColor('#1f1f1f');
          tg.setBackgroundColor('#1f1f1f');
        }
      } catch (e) {
        console.warn('Error configuring WebApp:', e);
      }

      // Platform-specific initialization
      if (tg.platform === 'android') {
        document.body.classList.add('android');
      }

      // Set viewport height
      const updateViewportHeight = () => {
        const height = tg.viewportHeight || window.innerHeight;
        const stableHeight = tg.viewportStableHeight || height;
        document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`);
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${stableHeight}px`);
      };
      updateViewportHeight();

      // Get user data with retries
      let userData;
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          userData = await getUserData(tg);
          if (userData?.id) break;
        } catch (error) {
          lastError = error;
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }

      if (!userData?.id) {
        throw lastError || new Error('Failed to get user data after retries');
      }

      const telegramId = String(userData.id);
      const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ');

      // Try to get existing session first
      let session = await checkSession();
      
      if (!session) {
        // If no session, try to sign in
        session = await AuthService.signIn(telegramId);
      }

      if (!session?.user) {
        throw new Error('No valid session after authentication');
      }

      const userObject = {
        id: telegramId,
        name: fullName || 'Пользователь',
        avatarUrl: userData.photo_url
      };
      
      setUser(userObject);
      setDebugState(prev => ({
        ...prev,
        initialization: {
          success: true,
          user: userObject,
          platform: tg.platform,
          version: tg.version,
          timestamp: new Date().toISOString()
        }
      }));

      console.log('Initialization successful:', userObject);
      console.groupEnd();
      return true;

    } catch (error) {
      console.error('Error in initialization:', error);
      setDebugState(prev => ({
        ...prev,
        initialization: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          mode: import.meta.env.DEV ? 'development' : 'production',
          timestamp: new Date().toISOString(),
          retryCount: initRetries
        }
      }));
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [getUserData, initRetries]);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: number;

    const tryInitialization = async () => {
      if (!mounted) return;

      try {
        await initializeTelegramUser();
      } catch (error) {
        console.error('Initialization attempt failed:', error);
        
        if (initRetries < AuthService.MAX_RETRIES) {
          const nextRetry = Math.min(initRetries + 1, AuthService.MAX_RETRIES);
          setInitRetries(nextRetry);
          
          if (mounted && nextRetry < AuthService.MAX_RETRIES) {
            const delay = 1000 * Math.pow(2, initRetries); // Exponential backoff
            console.log(`Scheduling retry in ${delay}ms`);
            retryTimeout = window.setTimeout(tryInitialization, delay);
          } else {
            console.error('Max retries reached');
          }
        }
      }
    };

    // Initial delay before first attempt
    const initialDelay = window.setTimeout(() => {
      tryInitialization();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(initialDelay);
      clearTimeout(retryTimeout);
    };
  }, [initializeTelegramUser, initRetries]);

  // Add window resize handler for viewport height
  useEffect(() => {
    const handleResize = () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        const height = tg.viewportHeight || window.innerHeight;
        const stableHeight = tg.viewportStableHeight || height;
        document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`);
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${stableHeight}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const userWithDebug = user ? {
    ...user,
    debug: {
      ...debugState,
      isInitializing,
      initRetries,
      mode: import.meta.env.DEV ? 'development' : 'production',
      platform: window.Telegram?.WebApp?.platform || 'unknown',
      version: window.Telegram?.WebApp?.version || 'unknown'
    }
  } : null;

  return userWithDebug;
}