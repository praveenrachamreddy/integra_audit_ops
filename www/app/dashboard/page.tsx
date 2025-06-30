'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLoading } from '@/components/ui/loading';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overview');
  }, [router]);

  return <DashboardLoading text="Loading dashboard..." />;
}