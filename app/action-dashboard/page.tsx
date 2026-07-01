'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';
import { AlertCircle, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ActionDashboard() {
  const router = useRouter();
  const { claims } = useAppState();
  const [showClaimMenu, setShowClaimMenu] = useState(false);

  // Calculate metrics
  const myReviewItems = claims.filter(c => ['Under Review', 'More Info Requested'].includes(c.status));
  const overdueItems = claims.filter(c => c.riskFlag === 'Overdue');
  const pendingApproval = claims.filter(c => c.status === 'Submitted');
  const approvedToday = claims.filter(c => c.status === 'Approved');

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Overdue') return 'bg-red-100 text-red-700';
    if (status === 'Due Soon') return 'bg-amber-100 text-amber-700';
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-slate-100 text-slate-700';
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header with Add Claim Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Action Dashboard</h1>
            <p className="text-slate-600">Day-to-day claims management and response actions</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowClaimMenu(!showClaimMenu)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1b5e3f] to-[#0d3a24] hover:from-[#0d3a24] hover:to-[#051c18] text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Claim / Variation
            </button>
            {showClaimMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                <button
                  onClick={() => { router.push('/submit-claim'); setShowClaimMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 font-medium text-slate-900"
                >
                  Submit Claim
                </button>
                <button
                  onClick={() => { router.push('/submit-claim'); setShowClaimMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 font-medium text-slate-900"
                >
                  Submit Variation Order (VO)
                </button>
                <button
                  onClick={() => { router.push('/submit-claim'); setShowClaimMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 font-medium text-slate-900"
                >
                  Submit RFI
                </button>
                <button
                  onClick={() => { router.push('/submit-claim'); setShowClaimMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 font-medium text-slate-900"
                >
                  Submit Design Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Priority Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <div
            onClick={() => router.push('/claims-queue?filter=overdue')}
            className="clickable-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Overdue</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">{overdueItems.length}</p>
            <p className="text-xs text-slate-500 mt-2">Items requiring immediate action</p>
          </div>

          <div
            onClick={() => router.push('/claims-queue?filter=review')}
            className="clickable-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">My Review Queue</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{myReviewItems.length}</p>
            <p className="text-xs text-slate-500 mt-2">Claims awaiting your review</p>
          </div>

          <div
            onClick={() => router.push('/claims-queue?filter=pending')}
            className="clickable-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Pending Approval</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600">{pendingApproval.length}</p>
            <p className="text-xs text-slate-500 mt-2">Newly submitted claims</p>
          </div>

          <div
            onClick={() => router.push('/claims-queue?filter=approved')}
            className="clickable-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Approved Today</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{approvedToday.length}</p>
            <p className="text-xs text-slate-500 mt-2">Approved this session</p>
          </div>
        </div>

        {/* Overdue Items */}
        {overdueItems.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-900">Overdue Items ({overdueItems.length})</h2>
            </div>
            <div className="space-y-3">
              {overdueItems.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push(`/claim-detail/${item.id}`)}
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.id}</p>
                    <p className="text-sm text-slate-600">{item.contractorName} • {item.packageId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">${item.value.toLocaleString()}</p>
                    <p className="text-xs text-red-600">{Math.abs(item.daysStatus)} days overdue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Review Queue */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Claims Queue - Assigned to You</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Deadline</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {myReviewItems.map(claim => (
                  <tr
                    key={claim.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/claim-detail/${claim.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-[#1b5e3f]">{claim.id}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.contractorName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">${claim.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.deadline}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/claim-detail/${claim.id}`);
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-200">
            <button
              onClick={() => router.push('/claims-queue')}
              className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm"
            >
              View all claims in queue →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/claims?filter=open')}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">View Open Claims</p>
                <p className="text-sm text-slate-600">{claims.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length} items</p>
              </button>
              <button
                onClick={() => router.push('/tbc-risks')}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">TBC Risk Management</p>
                <p className="text-sm text-slate-600">Manage contractor gaps</p>
              </button>
              <button
                onClick={() => router.push('/packages')}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Project Packages</p>
                <p className="text-sm text-slate-600">6 packages active</p>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Approvals</h3>
            <div className="space-y-3">
              {approvedToday.slice(0, 3).map(claim => (
                <div key={claim.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{claim.id}</p>
                    <p className="text-xs text-slate-600">${claim.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Status Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Under Review</span>
                <span className="font-semibold text-slate-900">{claims.filter(c => c.status === 'Under Review').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">More Info Needed</span>
                <span className="font-semibold text-slate-900">{claims.filter(c => c.status === 'More Info Requested').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Submitted</span>
                <span className="font-semibold text-slate-900">{claims.filter(c => c.status === 'Submitted').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Approved</span>
                <span className="font-semibold text-green-600">{claims.filter(c => c.status === 'Approved').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
