'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Clock, DollarSign, Plus } from 'lucide-react';
import { contractorPackages } from '@/lib/mock-data';
import { useState } from 'react';

export default function ContractorDashboard() {
  const router = useRouter();
  const { selectedContractor, claims } = useAppState();
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Filter claims for this contractor
  const myClaims = claims.filter(c => c.contractorName === selectedContractor);

  // Calculate metrics
  const submittedClaims = myClaims.filter(c => c.status === 'Submitted');
  const approvedClaims = myClaims.filter(c => c.status === 'Approved');
  const rejectedClaims = myClaims.filter(c => c.status === 'Rejected');
  const totalValue = myClaims.reduce((sum, c) => sum + c.value, 0);
  const approvedValue = approvedClaims.reduce((sum, c) => sum + c.value, 0);
  const myPackages = contractorPackages[selectedContractor || ''] || [];

  const awaiting = myClaims.filter(c => ['Under Review', 'More Info Requested'].includes(c.status));
  const overdue = myClaims.filter(c => c.riskFlag === 'Overdue');

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700';
    if (status === 'More Info Requested') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Access Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">You can only view claims and variations linked to your assigned Ecogas package(s).</p>
        </div>

        {/* Header with Add Claim Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-600 mt-1">Submit and track claims for {selectedContractor}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Submit Claim
            </button>
            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                <button
                  onClick={() => { router.push('/submit-claim'); setShowAddMenu(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 text-sm font-medium text-slate-900"
                >
                  New Claim
                </button>
                <button
                  onClick={() => { router.push('/submit-claim'); setShowAddMenu(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 text-sm font-medium text-slate-900"
                >
                  Variation Order (VO)
                </button>
                <button
                  onClick={() => { router.push('/submit-claim'); setShowAddMenu(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-900"
                >
                  RFI / Design Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button type="button" onClick={() => router.push('/my-claims')} className="clickable-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Claims Submitted</p>
                <p className="text-2xl font-bold text-slate-900">{myClaims.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </button>

          <button type="button" onClick={() => router.push('/my-claims?filter=approved')} className="clickable-card border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedClaims.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </button>

          <button type="button" onClick={() => router.push('/my-claims?filter=awaiting')} className="clickable-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Awaiting Response</p>
                <p className="text-2xl font-bold text-slate-900">{awaiting.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
          </button>

          <button type="button" onClick={() => router.push('/my-claims')} className="clickable-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Value Submitted</p>
                <p className="text-2xl font-bold text-slate-900">${(totalValue / 1000).toFixed(0)}k</p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-500" />
            </div>
          </button>
        </div>

        {/* Action Alert */}
        {overdue.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Overdue Items</h3>
                <p className="text-red-700">{overdue.length} of your claims are overdue. Please follow up with the project team.</p>
              </div>
            </div>
          </div>
        )}

        {/* My Assigned Packages */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">My Assigned Packages</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {myPackages.map(pkg => {
              const pkgClaims = myClaims.filter(c => c.packageId === pkg);
              return (
                <div
                  key={pkg}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all"
                  onClick={() => router.push(`/packages?selected=${pkg}`)}
                >
                  <p className="font-semibold text-slate-900 mb-3">Package {pkg}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">My Claims:</span>
                      <span className="font-medium text-slate-900">{pkgClaims.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Approved:</span>
                      <span className="font-medium text-green-600">{pkgClaims.filter(c => c.status === 'Approved').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Under Review:</span>
                      <span className="font-medium text-blue-600">{pkgClaims.filter(c => c.status === 'Under Review').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Value:</span>
                      <span className="font-medium text-slate-900">${(pkgClaims.reduce((s, c) => s + c.value, 0) / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Claims Summary */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Awaiting Response */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Awaiting Response ({awaiting.length})</h2>
            </div>
            <div className="space-y-3 p-6">
              {awaiting.slice(0, 5).map(claim => (
                <div
                  key={claim.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 p-2 rounded"
                  onClick={() => router.push(`/my-claims?selected=${claim.id}`)}
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{claim.id}</p>
                    <p className="text-sm text-slate-600">{claim.jobDescription}</p>
                    <p className="text-xs text-amber-600 mt-1">{claim.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Approvals */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Recent Approvals ({approvedClaims.length})</h2>
            </div>
            <div className="space-y-3 p-6">
              {approvedClaims.slice(0, 5).map(claim => (
                <div
                  key={claim.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-green-50 p-2 rounded"
                  onClick={() => router.push(`/my-claims?selected=${claim.id}`)}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{claim.id}</p>
                    <p className="text-sm text-slate-600">${claim.value.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">Approved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/my-claims')}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all text-left"
          >
            <h3 className="font-semibold text-slate-900 mb-2">View All My Claims</h3>
            <p className="text-sm text-slate-600">{myClaims.length} claims total • ${(totalValue / 1000).toFixed(0)}k value</p>
          </button>

          <button
            onClick={() => router.push('/submit-claim')}
            className="bg-[#1b5e3f] hover:bg-[#0d3a24] text-white rounded-lg p-6 transition-all text-left"
          >
            <h3 className="font-semibold mb-2">Submit New Claim</h3>
            <p className="text-sm text-green-100">Create a new claim or variation order</p>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
