'use client';

import { useAppState } from '@/lib/use-app-state';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

const roleHome = {
  admin: '/dashboard',
  'construction-manager': '/action-dashboard',
  contractor: '/my-dashboard',
} as const;

const roleRoutes = {
  admin: [
    '/dashboard',
    '/risk-status',
    '/packages',
    '/claims',
    '/tbc-risks',
    '/users',
    '/activity',
    '/settings',
    '/submit-claim',
    '/claim-detail',
  ],
  'construction-manager': [
    '/action-dashboard',
    '/claims-queue',
    '/packages',
    '/tbc-risks',
    '/activity',
    '/submit-claim',
    '/claim-detail',
  ],
  contractor: [
    '/my-dashboard',
    '/my-claims',
    '/submit-claim',
    '/notifications',
    '/profile',
    '/claim-detail',
  ],
} as const;

function isAllowedRoute(pathname: string, allowedRoutes: readonly string[]) {
  return allowedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!currentRole) {
      router.push('/');
      return;
    }

    if (!isAllowedRoute(pathname, roleRoutes[currentRole])) {
      router.replace(roleHome[currentRole]);
    }
  }, [currentRole, pathname, router]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!currentRole) {
    return <div className="flex h-screen items-center justify-center bg-slate-50" />;
  }

  if (!isAllowedRoute(pathname, roleRoutes[currentRole])) {
    return <div className="flex h-screen items-center justify-center bg-slate-50" />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
