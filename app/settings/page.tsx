'use client';

import { AppLayout } from '@/components/app-layout';
import { Bell, Lock, Users, Zap, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState('');
  const [securityState, setSecurityState] = useState({ passwordChanged: false, twoFactor: false });

  const closeModal = () => {
    setActiveModal(null);
    setSavedMessage('');
  };

  const saveModal = () => {
    setSavedMessage('Settings saved for this prototype session.');
    window.setTimeout(closeModal, 700);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Notifications</h3>
                <p className="text-slate-600 text-sm mb-4">Manage how you receive alerts and updates</p>
                <button
                  onClick={() => setActiveModal('notifications')}
                  className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
                >
                  Configure preferences →
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
                <p className="text-slate-600 text-sm mb-4">Password, two-factor authentication, and access control</p>
                <button
                  onClick={() => setActiveModal('security')}
                  className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
                >
                  Manage security →
                </button>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Team Management</h3>
                <p className="text-slate-600 text-sm mb-4">Add users, manage roles, and configure access</p>
                <button
                  onClick={() => router.push('/users')}
                  className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
                >
                  Manage team →
                </button>
              </div>
            </div>
          </div>

          {/* System */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">System</h3>
                <p className="text-slate-600 text-sm mb-4">Project configuration, backups, and integrations</p>
                <button
                  onClick={() => setActiveModal('system')}
                  className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
                >
                  Configure system →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="modal-shell">
          <div className="modal-card max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {activeModal === 'notifications' && 'Notification Preferences'}
                {activeModal === 'security' && 'Security Settings'}
                {activeModal === 'team' && 'Team Management'}
                {activeModal === 'system' && 'System Configuration'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {activeModal === 'notifications' && (
                <>
                  <label className="p-3 bg-slate-50 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-900">Email notifications for claims</span>
                  </label>
                  <label className="p-3 bg-slate-50 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-900">SMS alerts for overdue items</span>
                  </label>
                  <label className="p-3 bg-slate-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-slate-900">Daily summary digest</span>
                  </label>
                </>
              )}

              {activeModal === 'security' && (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Password</p>
                    <p className="text-xs text-blue-700 mb-3">Last changed 60 days ago</p>
                    <button
                      onClick={() => setSecurityState(prev => ({ ...prev, passwordChanged: true }))}
                      className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {securityState.passwordChanged ? 'Password Updated' : 'Change Password'}
                    </button>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-900 mb-2">Two-Factor Authentication</p>
                    <p className="text-xs text-amber-700 mb-3">{securityState.twoFactor ? 'Enabled for prototype user' : 'Not enabled'}</p>
                    <button
                      onClick={() => setSecurityState(prev => ({ ...prev, twoFactor: true }))}
                      className="text-sm px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded"
                    >
                      {securityState.twoFactor ? '2FA Enabled' : 'Enable 2FA'}
                    </button>
                  </div>
                </>
              )}

              {activeModal === 'team' && (
                <>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900 mb-3">Team Members</p>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>• Alzbeta (Admin) - alzbeta@ecogas.com</p>
                      <p>• Sarah Chen (Manager) - sarah@ecogas.com</p>
                      <p>• 7 Contractors assigned</p>
                    </div>
                  </div>
                  <button onClick={() => router.push('/users')} className="w-full px-4 py-2 bg-[#1b5e3f] hover:bg-[#0d3a24] text-white rounded-lg text-sm font-medium">
                    Open User Management
                  </button>
                </>
              )}

              {activeModal === 'system' && (
                <>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">System Version</p>
                      <p className="text-sm text-slate-900 font-medium">ClaimFlow v2.1.0</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Last Backup</p>
                      <p className="text-sm text-slate-900 font-medium">Today at 02:00 AM</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Database Status</p>
                      <p className="text-sm text-green-600 font-medium">✓ Healthy</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {savedMessage && (
              <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                {savedMessage}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 premium-button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="flex-1 premium-button-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
