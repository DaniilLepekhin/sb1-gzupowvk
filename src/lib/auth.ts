import { supabase } from './supabase';

export class AuthService {
  private static readonly EMAIL_DOMAIN = 'telegram.user';
  private static readonly PASSWORD_SUFFIX = '-secret-password';
  static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;
  private static readonly SESSION_KEY = 'sb-session';

  static async signIn(telegramId: string, retryCount = 0): Promise<any> {
    try {
      console.group('AuthService.signIn');
      console.log('Attempting sign in for telegram ID:', telegramId);
      console.log('Retry count:', retryCount);

      // First try to sign in
      console.log('Attempting to sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${telegramId}@${this.EMAIL_DOMAIN}`,
        password: `${telegramId}${this.PASSWORD_SUFFIX}`,
      });

      if (!signInError && signInData.session) {
        console.log('Sign in successful');
        return signInData.session;
      }

      // If sign in fails, create new account
      console.log('Sign in failed, creating new account...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${telegramId}@${this.EMAIL_DOMAIN}`,
        password: `${telegramId}${this.PASSWORD_SUFFIX}`,
        options: {
          data: { telegram_id: telegramId }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        throw signUpError;
      }

      if (!signUpData.session) {
        throw new Error('No session after signup');
      }

      // Create user profile
      console.log('Creating user profile...');
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: signUpData.user.id,
          telegram_id: telegramId,
          role: 'user'
        }, {
          onConflict: 'id'
        });

      if (userError) {
        console.error('Error creating user profile:', userError);
        throw userError;
      }

      console.log('Account creation successful');
      console.groupEnd();
      return signUpData.session;

    } catch (error) {
      console.error('Auth error:', error);
      
      // Implement retry logic
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retrying sign in (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
        return this.signIn(telegramId, retryCount + 1);
      }
      
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      // First try to get user by auth ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('telegram_id, role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error getting user by ID:', userError);
        return null;
      }

      if (!userData) {
        // If no user found by ID, try telegram_id from user metadata
        const telegramId = session.user.user_metadata?.telegram_id;
        if (!telegramId) return null;

        const { data: telegramUser, error: telegramError } = await supabase
          .from('users')
          .select('telegram_id, role')
          .eq('telegram_id', telegramId)
          .maybeSingle();

        if (telegramError) {
          console.error('Error getting user by telegram ID:', telegramError);
          return null;
        }

        return telegramUser;
      }

      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async refreshSession(retryCount = 0) {
    try {
      console.group('AuthService.refreshSession');
      console.log('Attempting to refresh session');
      console.log('Retry count:', retryCount);

      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (!data.session) {
        throw new Error('No session after refresh');
      }

      console.log('Session refreshed successfully');
      console.groupEnd();
      return data.session;
    } catch (error) {
      console.error('Error refreshing session:', error);

      // Implement retry logic
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retrying session refresh (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
        return this.refreshSession(retryCount + 1);
      }

      throw error;
    }
  }

  static async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}