'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useState } from 'react';
import { Claim, CommissionGap, TBCGap } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AlertCircle, Clock, Zap, CheckCircle, Search } from 'lucide-react';

export default function RiskStatusPage() {
  const router = useRouter();
  const { claims, commissionGaps, tbcGaps } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPackage, setFilterPackage] = useState<string | null>(null);
  const [filterResponsibility, setFilterResponsibility] = useState<string | null>(null);
  const [filterJobCode, setFilterJobCode] = useState<string | null>(null);
  const [filterContractor, setFilterContractor] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDeliveryPhase, setFilterDeliveryPhase] = useState<string | null>(null);
  const [filterRiskFlag, setFilterRiskFlag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('deadline');

  // Calculate key metrics
  const openClaims = claims.filter(c => ['Submitted', 'Under Review', 'More Info Requested'].includes(c.status)).length;
  const totalValueAtRisk = claims.reduce((sum, c) => sum + c.value, 0);
  const overdueItems = claims.filter(c => c.riskFlag === 'Overdue').length;
  const dueSoon = claims.filter(c => c.riskFlag === 'Due Soon').length;
  const unassignedTBC = tbcGaps.filter(g => !g.supplyContractor && !g.jobCode.includes('CFO')).length;
  const commissionGapsCount = commissionGaps.filter(g => !g.commissionContractor).length;
  const urgentGaps = tbcGaps.filter(g => g.riskLevel === 'Urgent' && !g.jobCode.includes('CFO')).length;

  // Pre-processing CFO items
  const cfoItems = tbcGaps.filter(g => g.jobCode.includes('CFO'));

  // Filter and sort claims
  let filteredClaims = [...claims];
  
  if (searchQuery) {
    filteredClaims = filteredClaims.filter(c =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filterStatus) filteredClaims = filteredClaims.filter(c => c.status === filterStatus);
  if (filterRiskFlag) filteredClaims = filteredClaims.filter(c => c.riskFlag === filterRiskFlag);
  if (filterPackage) filteredClaims = filteredClaims.filter(c => c.packageId === filterPackage);
  if (filterResponsibility) filteredClaims = filteredClaims.filter(c => c.responsibilityCode === filterResponsibility);
  if (filterJobCode) filteredClaims = filteredClaims.filter(c => c.jobCode === filterJobCode);
  if (filterContractor) filteredClaims = filteredClaims.filter(c => c.contractorName === filterContractor);
  if (filterType) filteredClaims = filteredClaims.filter(c => c.type === filterType);
  if (filterDeliveryPhase) filteredClaims = filteredClaims.filter(c => c.deliveryPhase === filterDeliveryPhase);

  filteredClaims.sort((a, b) => {
    if (sortBy === 'value') return b.value - a.value;
    if (sortBy === 'deadline') {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA.getTime() - dateB.getTime();
    }
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'urgency') {
      const urgencyMap: Record<string, number> = { 'Overdue': 0, 'Due Soon': 1, 'Under Review': 2, 'Submitted': 3, 'Approved': 4, 'Rejected': 5 };
      return (urgencyMap[a.status] || 6) - (urgencyMap[b.status] || 6);
    }
    return 0;
  });

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Overdue') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'Due Soon') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (status === 'Gap/TBC Urgent') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (status === 'Commission-phase TBC') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (status === 'Gap/TBC Standard') return 'bg-slate-100 text-slate-700 border-slate-200';
    if (status === 'Approved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const getRiskIcon = (risk: string) => {
    if (risk === 'Overdue') return <AlertCircle className="w-4 h-4" />;
    if (risk === 'Due Soon') return <Clock className="w-4 h-4" />;
    if (risk === 'Gap/TBC Urgent') return <Zap className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Risk & Status Dashboard</h1>
          <p className="text-slate-600">Designed for CTO and CFO visibility into overdue actions, open value exposure, commissioning gaps, and unresolved contract ownership.</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Total Open Claims</p>
            <p className="text-2xl font-bold text-slate-900">{openClaims}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Total Value at Risk</p>
            <p className="text-2xl font-bold text-amber-600">${(totalValueAtRisk / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Overdue Items</p>
            <p className="text-2xl font-bold text-red-600">{overdueItems}</p>
          </div>
          <div className="bg-white rounded-lg border border-amber-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Due Within 7 Days</p>
            <p className="text-2xl font-bold text-amber-600">{dueSoon}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Unassigned TBC Contracts</p>
            <p className="text-2xl font-bold text-slate-900">{unassignedTBC}</p>
          </div>
          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Gap/TBC Urgent Flags</p>
            <p className="text-2xl font-bold text-orange-600">{urgentGaps}</p>
          </div>
          <div className="bg-white rounded-lg border border-purple-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Commission Gaps</p>
            <p className="text-2xl font-bold text-purple-600">{commissionGapsCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-4">
            <p className="text-xs text-slate-500 mb-2">Pre-processing CFO Items</p>
            <p className="text-2xl font-bold text-red-600">{cfoItems.length}</p>
          </div>
        </div>

        {/* Executive Risk Snapshot */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Overdue Claims</h3>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-4">{overdueItems}</p>
            <p className="text-sm text-red-700 mb-4">
              {overdueItems > 0 ? `${overdueItems} item(s) require immediate attention` : 'All items on schedule'}
            </p>
            {overdueItems > 0 && (
              <button onClick={() => setFilterRiskFlag('Overdue')} className="text-red-600 hover:text-red-700 font-medium text-sm">
                View overdue →
              </button>
            )}
          </div>

          <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Due Soon</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-4">{dueSoon}</p>
            <p className="text-sm text-amber-700 mb-4">
              {dueSoon > 0 ? `${dueSoon} item(s) due within 7 days` : 'No items due soon'}
            </p>
            {dueSoon > 0 && (
              <button onClick={() => setFilterRiskFlag('Due Soon')} className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                View upcoming →
              </button>
            )}
          </div>

          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Gap/TBC Urgent</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-4">{urgentGaps}</p>
            <p className="text-sm text-orange-700 mb-4">
              {urgentGaps > 0 ? `${urgentGaps} urgent assignment(s) needed` : 'No urgent gaps'}
            </p>
            {urgentGaps > 0 && (
              <button onClick={() => router.push('/tbc-risks?section=urgent')} className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                View urgent →
              </button>
            )}
          </div>

          <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Commission-phase TBC</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-4">{commissionGapsCount}</p>
            <p className="text-sm text-purple-700 mb-4">
              {commissionGapsCount > 0 ? `${commissionGapsCount} commissioning assignment(s)` : 'All assigned'}
            </p>
            {commissionGapsCount > 0 && (
              <button onClick={() => router.push('/tbc-risks?section=commission')} className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View gaps →
              </button>
            )}
          </div>
        </div>

        {/* All Claims and Variations Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">All Claims & Variations</h2>
              <div className="flex gap-4 flex-1 md:flex-none md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="value">Sort by Value</option>
                  <option value="status">Sort by Status</option>
                  <option value="urgency">Sort by Urgency</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Advanced Filters</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Package</label>
                  <select
                    value={filterPackage || ''}
                    onChange={(e) => setFilterPackage(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Packages</option>
                    {Array.from(new Set(claims.map(c => c.packageId))).sort().map(pkg => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Responsibility Code</label>
                  <select
                    value={filterResponsibility || ''}
                    onChange={(e) => setFilterResponsibility(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Codes</option>
                    {Array.from(new Set(claims.map(c => c.responsibilityCode))).sort().map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Job Code</label>
                  <select
                    value={filterJobCode || ''}
                    onChange={(e) => setFilterJobCode(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Job Codes</option>
                    {Array.from(new Set(claims.map(c => c.jobCode))).sort().map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Claim Type</label>
                  <select
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Types</option>
                    {Array.from(new Set(claims.map(c => c.type))).sort().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Delivery Phase</label>
                  <select
                    value={filterDeliveryPhase || ''}
                    onChange={(e) => setFilterDeliveryPhase(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Phases</option>
                    {Array.from(new Set(claims.map(c => c.deliveryPhase))).sort().map(phase => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Status</label>
                  <select
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Statuses</option>
                    {Array.from(new Set(claims.map(c => c.status))).sort().map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Risk Flag</label>
                  <select
                    value={filterRiskFlag || ''}
                    onChange={(e) => setFilterRiskFlag(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Risk Flags</option>
                    {Array.from(new Set(claims.map(c => c.riskFlag))).sort().map(risk => (
                      <option key={risk} value={risk}>{risk}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Contractor</label>
                  <select
                    value={filterContractor || ''}
                    onChange={(e) => setFilterContractor(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">All Contractors</option>
                    {Array.from(new Set(claims.map(c => c.contractorName))).sort().map(contractor => (
                      <option key={contractor} value={contractor}>{contractor}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(filterPackage || filterResponsibility || filterJobCode || filterContractor || filterType || filterDeliveryPhase || filterStatus || filterRiskFlag) && (
                <button
                  onClick={() => {
                    setFilterPackage(null);
                    setFilterResponsibility(null);
                    setFilterJobCode(null);
                    setFilterContractor(null);
                    setFilterType(null);
                    setFilterDeliveryPhase(null);
                    setFilterStatus(null);
                    setFilterRiskFlag(null);
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Code</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Value NZD</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Deadline</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/claim-detail/${claim.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-[#1b5e3f]">{claim.id}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.packageId}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.responsibilityCode}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.contractorName}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.type}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${claim.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.deadline}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 w-fit ${getStatusBadgeColor(claim.riskFlag)}`}>
                        {getRiskIcon(claim.riskFlag)}
                        {claim.riskFlag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClaims.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No claims match your filters
            </div>
          )}
        </div>

        {/* Commission-phase Gaps Section */}
        <div id="commission-gaps" className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Commission-phase Gaps</h2>
            <p className="text-sm text-slate-600 mt-1">Separate from standard TBC - commission contractor assignments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Job Code</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Scope</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Supply Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Commission Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {commissionGaps.map((gap) => (
                  <tr key={gap.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{gap.packageId}</td>
                    <td className="px-6 py-4 text-slate-600">{gap.jobCode}</td>
                    <td className="px-6 py-4 text-slate-600">{gap.scope}</td>
                    <td className="px-6 py-4 text-slate-600">{gap.supplyContractor}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">
                        {gap.commissionContractor || (
                          <span className="text-purple-600 font-medium">TBC</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          gap.riskLevel === 'Urgent'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {gap.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pre-processing CFO Block */}
        {cfoItems.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-300 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Pre-processing CFO Fully Unassigned</h3>
                <p className="text-slate-700">Complete section with no contractor assigned across Design, Supply, Construct, or Commission.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Loader', 'Forklift', 'Irrigation', 'Depacker with hopper', 'Screw Press', 'Skip Bin', 'Magnet Box', 'Pump', 'Macerator', 'Bunkers', 'Support Structures'].map((item) => (
                <span key={item} className="px-3 py-1 bg-orange-200 text-orange-900 text-xs font-medium rounded-full">
                  {item}
                </span>
              ))}
            </div>
            <button onClick={() => router.push('/tbc-risks?section=cfo')} className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
              Open TBC Risk View →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
