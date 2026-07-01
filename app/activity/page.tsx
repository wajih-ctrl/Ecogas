'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useState, useMemo } from 'react';
import { RotateCcw, Search } from 'lucide-react';

export default function ActivityPage() {
  const { claims } = useAppState();
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterPackage, setFilterPackage] = useState('');
  const [searchClaim, setSearchClaim] = useState('');

  const allEvents = useMemo(() => {
    return claims.flatMap(claim =>
      claim.auditTrail.map(event => ({
        id: `${claim.id}-${event.timestamp}`,
        claimId: claim.id,
        packageId: claim.packageId,
        packageName: claim.packageName,
        contractorName: claim.contractorName,
        ...event,
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [claims]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (filterUser && event.user !== filterUser) return false;
      if (filterAction && event.action !== filterAction) return false;
      if (filterPackage && event.packageId !== filterPackage) return false;
      if (searchClaim && !event.claimId.toLowerCase().includes(searchClaim.toLowerCase())) return false;
      return true;
    });
  }, [allEvents, filterUser, filterAction, filterPackage, searchClaim]);

  const uniqueUsers = Array.from(new Set(allEvents.map(e => e.user)));
  const uniqueActions = Array.from(new Set(allEvents.map(e => e.action)));
  const uniquePackages = Array.from(new Set(allEvents.map(e => e.packageId)));
  const hasFilters = Boolean(filterUser || filterAction || filterPackage || searchClaim);

  const resetFilters = () => {
    setFilterUser('');
    setFilterAction('');
    setFilterPackage('');
    setSearchClaim('');
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Activity Log</h1>
          <p className="text-slate-600">Complete audit trail of all claims, variations, and project changes with detailed change history.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 overflow-visible">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Filters</p>
              <p className="text-xs text-slate-500">Narrow the audit trail by claim, user, action, or package.</p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              className="premium-button-secondary w-full md:w-auto disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-visible">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Search Claim ID</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchClaim}
                  onChange={(e) => setSearchClaim(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                />
              </div>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">User</label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            {/* Package Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Package</label>
              <select
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">All Packages</option>
                {uniquePackages.sort().map(pkg => (
                  <option key={pkg} value={pkg}>{pkg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Date/Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Action</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID / Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">{event.timestamp}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium text-sm">{event.user}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {event.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{event.claimId}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{event.contractorName}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{event.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <p>No activity matching filters</p>
            </div>
          )}
        </div>

        <div className="text-sm text-slate-600 flex justify-between">
          <p>Total events: {filteredEvents.length}</p>
          <p>All times in NZ timezone</p>
        </div>
      </div>
    </AppLayout>
  );
}
