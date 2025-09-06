import { notFound } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { AuditGenieContent } from '@/components/dashboard/audit-genie-content';
import { AssistantContent } from '@/components/dashboard/assistant-content';
import { QAContent } from '@/components/dashboard/qa-content';
import { DocumentsContent } from '@/components/dashboard/documents-content';
import { SettingsContent } from '@/components/dashboard/settings-content';
import { HelpContent } from '@/components/dashboard/help-content';
import { ProjectsDashboard } from '@/components/dashboard/projects-dashboard';

// Map of valid routes to their components
const routeComponents = {
  'overview': DashboardOverview,
  'audit': AuditGenieContent,
  'assistant': AssistantContent,
  'qa': QAContent,
  'documents': DocumentsContent,
  'settings': SettingsContent,
  'help': HelpContent,
  'projects': ProjectsDashboard,
} as const;

interface DashboardPageProps {
  params: {
    slug?: string[];
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  // Default to overview if no slug
  const route = params.slug?.[0] || 'overview';
  
  // Check if route is valid
  if (!(route in routeComponents)) {
    notFound();
  }
  
  const Component = routeComponents[route as keyof typeof routeComponents];
  
  return <Component />;
}

// Generate static params for valid routes
export function generateStaticParams() {
  return Object.keys(routeComponents).map((route) => ({
    slug: [route],
  }));
} 