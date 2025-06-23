import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  company?: string;
  location?: string;
  role?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  company: string;
  location: string;
  role: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, firstName: string, lastName: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuthStatus: () => void;
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
          // Mock login logic - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate validation
          if (!email || !password) {
            throw new Error('Please provide both email and password');
          }
          
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'John',
            lastName: 'Doe',
            role: 'user'
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },
      
      register: async (email: string, firstName: string, lastName: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration logic - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simulate validation
          if (!email || !firstName || !lastName) {
            throw new Error('Please provide all required information');
          }
          
          // In a real app, this would send an email verification
          // For now, we just simulate success
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
      
      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          // Mock signup logic - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simulate validation
          if (!data.email || !data.fullName || !data.company) {
            throw new Error('Please provide all required information');
          }
          
          const mockUser: User = {
            id: Date.now().toString(),
            email: data.email,
            fullName: data.fullName,
            company: data.company,
            location: data.location,
            role: data.role
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      checkAuthStatus: () => {
        // In a real app, this would check with the server
        // For now, just check if we have a stored user
        const state = get();
        if (state.user && !state.isAuthenticated) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 