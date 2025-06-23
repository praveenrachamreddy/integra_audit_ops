import { create } from 'zustand';

interface Permit {
  id: string;
  title: string;
  type: string;
  status: 'approved' | 'rejected' | 'pending' | 'under_review';
  progress: number;
  submittedDate: string;
  lastUpdated: string;
}

interface ComplianceCheck {
  id: string;
  title: string;
  type: string;
  status: 'compliant' | 'non_compliant' | 'warning' | 'pending';
  lastChecked: string;
  issues: string[];
  score?: number;
}

interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  currentPage: string;
  permits: Permit[];
  complianceChecks: ComplianceCheck[];
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrentPage: (page: string) => void;
}

// Mock data
const mockPermits: Permit[] = [
  {
    id: '1',
    title: 'Environmental Impact Assessment',
    type: 'Environmental',
    status: 'approved',
    progress: 100,
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    title: 'Building Construction Permit',
    type: 'Construction',
    status: 'under_review',
    progress: 75,
    submittedDate: '2024-01-10',
    lastUpdated: '2024-01-18'
  },
  {
    id: '3',
    title: 'Water Usage License',
    type: 'Utilities',
    status: 'pending',
    progress: 45,
    submittedDate: '2024-01-08',
    lastUpdated: '2024-01-12'
  },
  {
    id: '4',
    title: 'Fire Safety Certification',
    type: 'Safety',
    status: 'approved',
    progress: 100,
    submittedDate: '2024-01-05',
    lastUpdated: '2024-01-14'
  }
];

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: '1',
    title: 'Safety Protocols Review',
    type: 'Safety',
    status: 'compliant',
    lastChecked: '2024-01-20',
    issues: [],
    score: 95
  },
  {
    id: '2',
    title: 'Environmental Standards Audit',
    type: 'Environmental',
    status: 'warning',
    lastChecked: '2024-01-18',
    issues: ['Minor documentation gaps', 'Update required for Q1 report'],
    score: 82
  },
  {
    id: '3',
    title: 'Financial Compliance Check',
    type: 'Financial',
    status: 'compliant',
    lastChecked: '2024-01-15',
    issues: [],
    score: 98
  },
  {
    id: '4',
    title: 'Data Protection Assessment',
    type: 'Privacy',
    status: 'non_compliant',
    lastChecked: '2024-01-12',
    issues: ['Missing encryption for sensitive data', 'Access logs incomplete', 'Privacy policy needs update'],
    score: 65
  }
];

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  theme: 'system',
  currentPage: 'dashboard',
  permits: mockPermits,
  complianceChecks: mockComplianceChecks,
  
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
  },
  
  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },
})); 