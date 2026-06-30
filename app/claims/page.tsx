'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';

export default function ClaimsPage() {
  const router = useRouter();
  const { claims, updateClaim } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get('filter');
    if (filter) setFilterStatus(filter);
  }, []);

  const contractors = Array.from(new Set(claims.map(c => c.contractorName)));
  const packages = Array.from(new Set(claims.map(c => c.packageId)));

  let filteredClaims = [...claims];

  if (filterStatus) {
    if (filterStatus === 'open') {
      filteredClaims = filteredClaims.filter(c => ['Submitted', 'Under Review', 'More Info Requested'].includes(c.status));
    } else if (filterStatus === 'overdue') {
      filteredClaims = filteredClaims.filter(c => c.riskFlag === 'Overdue');
    } else if (filterStatus === 'dueSoon') {
      filteredClaims = filteredClaims.filter(c => c.riskFlag === 'Due Soon');
    } else {
      filteredClaims = filteredClaims.filter(c => c.status === filterStatus);
    }
  }

  if (selectedContractor) {
    filteredClaims = filteredClaims.filter(c => c.contractorName === selectedContractor);
  }

  if (selectedPackage) {
    filteredClaims = filteredClaims.filter(c => c.packageId === selectedPackage);
  }

  if (searchQuery) {
    filteredClaims = filteredClaims.filter(c =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleStatusChange = (claimId: string, newStatus: string) => {
    updateClaim(claimId, { status: newStatus as any });
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Overdue') return 'bg-red-100 text-red-700';
    if (status === 'Due Soon') return 'bg-amber-100 text-amber-700';
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-slate-100 text-slate-700';
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-50 text-slate-600';
  };

  const getPackageColor = (pkg: string) => {
    const colors: Record<string, string> = {
      '30402': 'bg-slate-100 text-slate-700',
      '30403': 'bg-blue-100 text-blue-700',
      '30404': 'bg-purple-100 text-purple-700',
      '30405': 'bg-green-100 text-green-700',
      '30406': 'bg-amber-100 text-amber-700',
      '30407': 'bg-indigo-100 text-indigo-700',
    };
    return colors[pkg] || 'bg-slate-100 text-slate-700';
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Claims & Variations</h1>
            <p className="text-slate-600">Central list of all claims, variation orders, RFIs, and design changes</p>
          </div>
          <button
            onClick={() => router.push('/submit-claim')}
            className="premium-button-primary"
          >
            <Plus className="w-4 h-4" />
            Add New Claim
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Status</label>
              <select
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="w-full"
              >
                <option value="">All statuses</option>
                <option value="open">Open</option>
                <option value="overdue">Overdue</option>
                <option value="dueSoon">Due Soon</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="More Info Requested">More Info Requested</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Package</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">All packages</option>
                {packages.map(pkg => (
                  <option key={pkg} value={pkg}>{pkg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Contractor</label>
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">All contractors</option>
                {contractors.map(contractor => (
                  <option key={contractor} value={contractor}>{contractor}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus(null);
                  setSelectedContractor('');
                  setSelectedPackage('');
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Value NZD</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Submitted</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Deadline</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-[#1b5e3f] cursor-pointer" onClick={() => router.push(`/claim-detail/${claim.id}`)}>
                      {claim.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{claim.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPackageColor(claim.packageId)}`}>
                        {claim.packageId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{claim.contractorName}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${claim.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.submitted}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.deadline}</td>
                    <td className="px-6 py-4">
                      <select
                        value={claim.status}
                        onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer ${getStatusBadgeColor(claim.status)}`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="More Info Requested">More Info Requested</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => router.push(`/claim-detail/${claim.id}`)} className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClaims.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No claims found
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
