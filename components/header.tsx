'use client';

import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, User as UserIcon, Search, X, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const router = useRouter();
  const { currentUser, currentRole, selectedContractor, logout } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleRoleSwitch = () => {
    logout();
    router.push('/');
  };

  const getRoleDisplay = () => {
    if (currentRole === 'admin') return 'Ecogas Admin';
    if (currentRole === 'construction-manager') return 'Construction Manager';
    if (currentRole === 'contractor') return `${selectedContractor}`;
    return '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-full">
        {/* Left: Logo & Project */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-[#1b5e3f] to-[#0d3a24] rounded-lg flex items-center justify-center">
            <div className="text-white text-sm font-bold">CF</div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-900">ClaimFlow</h1>
            <p className="text-xs text-slate-500">Ecogas Christchurch</p>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search claims, packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
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

          {/* Role Switch */}
          <button
            onClick={handleRoleSwitch}
            className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            Switch Role
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
