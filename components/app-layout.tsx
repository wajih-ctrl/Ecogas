'use client';

import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentRole } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentRole) {
      router.push('/');
    }
  }, [currentRole, router]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!currentRole) {
    return <div className="flex h-screen items-center justify-center bg-slate-50" />;
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
