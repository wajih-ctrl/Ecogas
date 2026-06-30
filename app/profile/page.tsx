'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';

export default function ProfilePage() {
  const { currentUser } = useAppState();

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Profile</h1>

        <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Name</label>
            <p className="text-lg font-semibold text-slate-900">{currentUser?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
            <p className="text-lg font-semibold text-slate-900">{currentUser?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Role</label>
            <p className="text-lg font-semibold text-slate-900">
              {currentUser?.role === 'admin' ? 'Ecogas Admin' : currentUser?.role === 'construction-manager' ? 'Construction Manager' : 'Contractor'}
            </p>
          </div>

          {currentUser?.contractor && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Organization</label>
              <p className="text-lg font-semibold text-slate-900">{currentUser.contractor}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              Active
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
