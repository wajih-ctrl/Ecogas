'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useState } from 'react';
import { Plus, Edit3, Eye, Trash2, X } from 'lucide-react';
import { User } from '@/lib/types';
import { mockPackages } from '@/lib/mock-data';

export default function UsersPage() {
  const { users, addUser, updateUser } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'construction-manager' as const, 
    roleType: 'Construction Contractor', 
    permissionRole: 'contractor',
    packages: [] as string[]
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        roleType: newUser.roleType,
        permissionRole: newUser.permissionRole,
        assignedPackages: newUser.packages,
      };
      addUser(user);
      setNewUser({ name: '', email: '', role: 'construction-manager', roleType: 'Construction Contractor', permissionRole: 'contractor', packages: [] });
      setShowAddModal(false);
    }
  };

  const handleDeactivate = (userId: string) => {
    updateUser(userId, { status: 'inactive' });
    setConfirmation('User deactivated for this prototype session.');
  };

  const handleRemoveUser = (userId: string) => {
    updateUser(userId, { status: 'inactive' });
    setConfirmation(`User ${userId} marked inactive in this prototype session.`);
  };

  const handleViewAccess = (userId: string) => {
    setViewingUserId(userId);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Users</h1>
            <p className="text-slate-600">Manage project team and access</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1b5e3f] hover:bg-[#0d3a24] text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
        {confirmation && (
          <div className="premium-panel border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {confirmation}
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Role Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Permission</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Packages</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {user.roleType || 'Construction Contractor'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {user.permissionRole || 'Contractor'}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {user.assignedPackages && user.assignedPackages.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {user.assignedPackages.map(pkg => (
                            <span key={pkg} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {pkg}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="table-actions">
                        <button
                          onClick={() => handleViewAccess(user.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="View access"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewAccess(user.id)}
                          className="text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit user"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            title="Deactivate"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-shell">
            <div className="modal-card max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Add New User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Permission Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="admin">Admin</option>
                    <option value="construction-manager">Construction Manager</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Role Type</label>
                    <select
                      value={newUser.roleType}
                      onChange={(e) => setNewUser({ ...newUser, roleType: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                    >
                      <option value="Construction Contractor">Construction Contractor</option>
                      <option value="Design Consultant">Design Consultant</option>
                      <option value="Placeholder">Placeholder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Permission Role</label>
                    <select
                      value={newUser.permissionRole}
                      onChange={(e) => setNewUser({ ...newUser, permissionRole: e.target.value as any })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                    >
                      <option value="admin">Admin</option>
                      <option value="construction-manager">Mgr</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Assign to Packages</label>
                  <div className="space-y-2 max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {mockPackages.map(pkg => (
                      <label key={pkg.id} className="cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={newUser.packages.includes(pkg.id)}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            packages: e.target.checked
                              ? [...newUser.packages, pkg.id]
                              : newUser.packages.filter(p => p !== pkg.id)
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{pkg.id}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-4 py-2 bg-[#1b5e3f] hover:bg-[#0d3a24] text-white font-medium rounded-lg transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Access Modal */}
        {viewingUserId && (
          <div className="modal-shell">
            <div className="modal-card max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">User Access</h2>
                <button onClick={() => setViewingUserId(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {users.find(u => u.id === viewingUserId) && (
                <div className="space-y-4">
                  {(() => {
                    const user = users.find(u => u.id === viewingUserId);
                    return user ? (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Name</p>
                          <p className="text-slate-900">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Email</p>
                          <p className="text-slate-600 text-sm">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Role Type</p>
                          <p className="text-slate-900">{user.roleType || 'Construction Contractor'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Permission Role</p>
                          <p className="text-slate-900">{user.permissionRole || 'Contractor'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-2">Assigned Packages</p>
                          <div className="space-y-1">
                            {user.assignedPackages && user.assignedPackages.length > 0 ? (
                              user.assignedPackages.map(pkg => (
                                <div key={pkg} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                  {pkg}
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-500 text-sm">No packages assigned</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Can Access</p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            <li>• View assigned packages</li>
                            <li>• Submit claims</li>
                            <li>• View own claims</li>
                            {user.permissionRole === 'construction-manager' && <li>• Manage queue</li>}
                            {user.permissionRole === 'admin' && <li>• Full access</li>}
                          </ul>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
