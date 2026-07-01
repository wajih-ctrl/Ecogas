'use client';

import { useAppState } from '@/lib/use-app-state';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  Bell,
  Clock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar({
  isOpen = false,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}: {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { currentRole } = useAppState();

  const adminNav: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Risk & Status', href: '/risk-status', icon: <AlertTriangle className="w-5 h-5" /> },
    { label: 'Project Packages', href: '/packages', icon: <Package className="w-5 h-5" /> },
    { label: 'Claims & Variations', href: '/claims', icon: <FileText className="w-5 h-5" /> },
    { label: 'TBC Risk View', href: '/tbc-risks', icon: <Zap className="w-5 h-5" /> },
    { label: 'Users', href: '/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Activity Log', href: '/activity', icon: <Clock className="w-5 h-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const cmNav: NavItem[] = [
    { label: 'Action Dashboard', href: '/action-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Claims Queue', href: '/claims-queue', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Project Packages', href: '/packages', icon: <Package className="w-5 h-5" /> },
    { label: 'TBC Risk View', href: '/tbc-risks', icon: <Zap className="w-5 h-5" /> },
    { label: 'Activity Log', href: '/activity', icon: <Clock className="w-5 h-5" /> },
  ];

  const contractorNav: NavItem[] = [
    { label: 'My Dashboard', href: '/my-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Claims', href: '/my-claims', icon: <FileText className="w-5 h-5" /> },
    { label: 'Submit Claim', href: '/submit-claim', icon: <FileText className="w-5 h-5" /> },
    { label: 'Notifications', href: '/notifications', icon: <Bell className="w-5 h-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems =
    currentRole === 'admin'
      ? adminNav
      : currentRole === 'construction-manager'
        ? cmNav
        : currentRole === 'contractor'
          ? contractorNav
          : [];

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname === href || pathname.startsWith(`${href}/`);

  const renderContent = (showCloseButton: boolean, collapsed = false) => (
    <>
      <div className={`px-4 py-4 border-b border-slate-200 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex gap-2 ${collapsed ? 'flex-col items-center' : 'items-center justify-between'}`}>
          <div className={`flex min-w-0 items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="h-10 w-10 rounded-xl bg-[#14533b] p-1.5 shadow-sm flex-shrink-0">
              <img src="/white-logo.png" alt="Ecogas" className="h-full w-full object-contain" />
            </div>
            <div className={`min-w-0 ${collapsed ? 'hidden' : ''}`}>
              <p className="text-sm font-semibold leading-tight text-slate-900 truncate">ClaimFlow</p>
              <p className="text-xs leading-tight text-slate-500 truncate">Ecogas Christchurch</p>
            </div>
          </div>
          {!showCloseButton && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            title={collapsed ? item.label : undefined}
            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive(item.href)
                ? 'bg-[#14533b] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`truncate ${collapsed ? 'sr-only' : ''}`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={`border-t border-slate-200 px-4 py-3 ${collapsed ? 'hidden' : ''}`}>
        <p className="text-xs text-slate-500 text-center">2026 Ecogas</p>
        <p className="text-xs text-slate-500 text-center">ClaimFlow v1.0</p>
      </div>
    </>
  );

  return (
    <>
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0 z-40 transition-[width] duration-200`}>
        {renderContent(false, isCollapsed)}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <button
            type="button"
            aria-label="Dismiss navigation overlay"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[82vw] max-w-80 bg-white border-r border-slate-200 shadow-2xl flex flex-col">
            {renderContent(true, false)}
          </aside>
        </div>
      )}
    </>
  );
}
