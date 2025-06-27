import { notFound } from 'next/navigation';
import { SettingsContent } from '@/components/dashboard/settings-content';
import { AssistantContent } from '@/components/dashboard/assistant-content';
import { DocumentsContent } from '@/components/dashboard/documents-content';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { AuditGenieContent } from '@/components/dashboard/audit-genie-content';
import { SmartPermitContent } from '@/components/dashboard/smart-permit-content';

interface DashboardPageProps {
  params: {
    slug: string[];
  };
}

const routeComponents = {
  'overview': DashboardOverview,
  'permits': SmartPermitContent,
  'smart-permit': SmartPermitContent, // Legacy support
  'audit': AuditGenieContent,
  'audit-genie': AuditGenieContent, // Legacy support
  'assistant': AssistantContent,
  'documents': DocumentsContent,
  'settings': SettingsContent,
} as const;

export default function DashboardPage({ params }: DashboardPageProps) {
  const route = params.slug?.[0] || 'overview';
  const Component = routeComponents[route as keyof typeof routeComponents];

  if (!Component) {
    notFound();
  }

  return <Component />;
}

export function generateStaticParams() {
  return [
    { slug: ['overview'] },
    { slug: ['permits'] },
    { slug: ['smart-permit'] },
    { slug: ['audit'] },
    { slug: ['audit-genie'] },
    { slug: ['assistant'] },
    { slug: ['documents'] },
    { slug: ['settings'] },
  ];
} 