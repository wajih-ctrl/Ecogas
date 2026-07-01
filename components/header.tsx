'use client';

import { useAppState } from '@/lib/use-app-state';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User as UserIcon, X, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, currentRole, selectedContractor, logout } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleDisplay = () => {
    if (currentRole === 'admin') return 'Ecogas Admin';
    if (currentRole === 'construction-manager') return 'Construction Manager';
    if (currentRole === 'contractor') return `${selectedContractor}`;
    return '';
  };

  const pageTitleMap: Record<string, string> = {
    '/dashboard': 'Admin Dashboard',
    '/risk-status': 'Risk & Status',
    '/packages': 'Project Packages',
    '/claims': 'Claims & Variations',
    '/tbc-risks': 'TBC Risk View',
    '/users': 'Users',
    '/activity': 'Activity Log',
    '/settings': 'Settings',
    '/action-dashboard': 'Action Dashboard',
    '/claims-queue': 'Claims Queue',
    '/my-dashboard': 'My Dashboard',
    '/my-claims': 'My Claims',
    '/submit-claim': 'Submit Claim',
    '/notifications': 'Notifications',
    '/profile': 'Profile',
  };

  const pageTitle =
    pathname.startsWith('/claim-detail')
      ? 'Claim Detail'
      : pageTitleMap[pathname] || 'Project Control';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 max-w-full">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">{pageTitle}</p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">Ecogas Christchurch project controls</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <UserIcon className="w-4 h-4 text-slate-600" />
            <div className="text-xs">
              <p className="font-medium text-slate-900">{getRoleDisplay()}</p>
              <p className="text-slate-500">{currentUser?.name}</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-200">
                  <div className="p-4 hover:bg-slate-50 cursor-pointer">
                    <p className="font-medium text-sm text-slate-900">Claim CLM-1028 Approved</p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-4 hover:bg-slate-50 cursor-pointer">
                    <p className="font-medium text-sm text-slate-900">3 Claims Pending Review</p>
                    <p className="text-xs text-slate-500 mt-1">4 hours ago</p>
                  </div>
                  <div className="p-4 hover:bg-slate-50 cursor-pointer">
                    <p className="font-medium text-sm text-slate-900">Overdue Response: CLM-1022</p>
                    <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                  </div>
                  <div className="p-4 hover:bg-slate-50 cursor-pointer">
                    <p className="font-medium text-sm text-slate-900">TBC Gap Assigned: Package EC-006</p>
                    <p className="text-xs text-slate-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
