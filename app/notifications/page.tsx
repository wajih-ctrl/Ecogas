'use client';

import { AppLayout } from '@/components/app-layout';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: '1', type: 'approval', title: 'Claim Approved', message: 'Your claim CLM-30405-022 has been approved', time: '2 hours ago' },
    { id: '2', type: 'info', title: 'Status Update', message: 'VO-30406-022 is now under review', time: '4 hours ago' },
    { id: '3', type: 'alert', title: 'Action Required', message: 'RFI-30405-011 needs your response', time: '1 day ago' },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Notifications</h1>

        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="bg-white rounded-lg border border-slate-200 p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-100">
                {notif.type === 'approval' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {notif.type === 'alert' && <AlertCircle className="w-6 h-6 text-amber-600" />}
                {notif.type === 'info' && <Info className="w-6 h-6 text-blue-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                <p className="text-slate-600 text-sm mt-1">{notif.message}</p>
                <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
