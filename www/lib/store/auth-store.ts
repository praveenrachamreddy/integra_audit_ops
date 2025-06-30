import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, User, RegisterRequest, LoginRequest } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // Initialize auth state from tokens
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const loginData: LoginRequest = { email, password };
          await authApi.login(loginData);
          
          // Get user data after successful login
          await get().getCurrentUser();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (email: string, firstName: string, lastName: string) => {
        set({ isLoading: true, error: null });
        try {
          const registerData: RegisterRequest = {
            email,
            first_name: firstName,
            last_name: lastName
          };
          await authApi.register(registerData);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw error;
        }
      },
      
      getCurrentUser: async () => {
        // Don't set loading if we're already loading or have no token
        if (!authApi.isLoggedIn()) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        
        const currentState = get();
        if (!currentState.isLoading) {
          set({ isLoading: true, error: null });
        }
        
        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Failed to get current user:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for failed auth checks
          });
        }
      },
      
      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      initialize: async () => {
        // Check if we have tokens and try to get user data
        if (authApi.isLoggedIn()) {
          await get().getCurrentUser();
        } else {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist user data, not tokens (tokens are in localStorage separately)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, initialize the auth state
        if (state) {
          state.initialize();
        }
      },
    }
  )
); 