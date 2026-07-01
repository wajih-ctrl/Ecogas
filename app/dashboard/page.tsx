'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, TrendingUp, Clock, Activity, Package, DollarSign, Target, CheckCircle, XCircle, Users, FileText, Zap, Plus } from 'lucide-react';
import Link from 'next/link';
import { Claim, DeliveryPhase } from '@/lib/types';
import { MetricCard } from '@/components/ui/metric-card';
import { mockPackages } from '@/lib/mock-data';

export default function AdminDashboard() {
  const router = useRouter();
  const { claims, tbcGaps, commissionGaps } = useAppState();
  const [filterPackage, setFilterPackage] = useState('');
  const [filterResponsibility, setFilterResponsibility] = useState('');
  const [filterContractor, setFilterContractor] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPhase, setFilterPhase] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Calculate metrics
  const totalContracts = 22; // Total active contracts
  const confirmedContractors = 18; // Confirmed on portal
  const totalClaims = claims.length;
  const openClaims = claims.filter(c => ['Submitted', 'Under Review', 'More Info Requested'].includes(c.status)).length;
  const overdueItems = claims.filter(c => c.riskFlag === 'Overdue').length;
  const dueSoon = claims.filter(c => c.riskFlag === 'Due Soon').length;
  const approvedThisMonth = claims.filter(c => c.status === 'Approved').length;
  const rejectedThisMonth = claims.filter(c => c.status === 'Rejected').length;
  const totalValueAtRisk = claims.reduce((sum, c) => sum + c.value, 0);
  const unassignedTBC = tbcGaps.filter(g => !g.supplyContractor && g.jobCode.includes('CFO')).length;
  const preProcessingCFOUnassigned = tbcGaps.filter(g => g.jobCode.includes('CFO')).length;
  const commissionGapsCount = commissionGaps.filter(g => !g.commissionContractor).length;
  const urgentTBC = tbcGaps.filter(g => g.riskLevel === 'Urgent' && !g.jobCode.includes('CFO')).length;
  const gapTbcStandard = tbcGaps.filter(g => g.riskLevel === 'Standard' && !g.jobCode.includes('CFO')).length;
  const commissionPhaseGaps = tbcGaps.filter(g => g.jobCode.includes('-C')).length;
  const cfoItems = tbcGaps.filter(g => g.jobCode.includes('CFO')).length;

  const handleCardClick = (type: string) => {
    if (type === 'totalContracts' || type === 'confirmedContractors') {
      router.push('/users');
    } else if (type === 'openClaims') {
      router.push('/claims?filter=open');
    } else if (type === 'valueAtRisk') {
      router.push('/risk-status');
    } else if (type === 'overdue') {
      router.push('/claims?filter=overdue');
    } else if (type === 'dueSoon') {
      router.push('/claims?filter=dueSoon');
    } else if (type === 'cfoUnassigned') {
      router.push('/tbc-risks?section=cfo');
    } else if (type === 'commissionGaps') {
      router.push('/tbc-risks?section=commission');
    } else if (type === 'urgentTBC') {
      router.push('/tbc-risks?section=urgent');
    } else if (type === 'standardTBC') {
      router.push('/tbc-risks?section=standard');
    } else if (type === 'approved') {
      router.push('/claims?filter=Approved');
    } else if (type === 'rejected') {
      router.push('/claims?filter=Rejected');
    }
  };

  const deliveryPhases: DeliveryPhase[] = ['Design', 'Supply / Procurement', 'Construct', 'Commission', 'Handover Docs', 'Compliance Docs'];

  const phaseBreakdown = deliveryPhases.map(phase => ({
    phase,
    count: claims.filter(c => c.deliveryPhase === phase).length,
    overdue: claims.filter(c => c.deliveryPhase === phase && c.riskFlag === 'Overdue').length,
    value: claims.filter(c => c.deliveryPhase === phase).reduce((sum, c) => sum + c.value, 0),
  }));

  const recentActivity = [
    { id: '1', text: 'Hanham & Philp submitted VO-30402-018', time: '2 hours ago' },
    { id: '2', text: 'Construction Manager assigned RFI-30405-011 to BG', time: '4 hours ago' },
    { id: '3', text: 'Claim VO-30406-022 marked Under Review', time: '1 day ago' },
    { id: '4', text: 'Gap/TBC Urgent flagged for 30407 Security', time: '1 day ago' },
    { id: '5', text: 'Commission-phase TBC identified for 30405 mixers', time: '2 days ago' },
  ];

  const filteredDashboardClaims = claims.filter(claim =>
    (!filterPackage || claim.packageId === filterPackage) &&
    (!filterResponsibility || claim.responsibilityCode === filterResponsibility) &&
    (!filterContractor || claim.contractorName === filterContractor) &&
    (!filterType || claim.type === filterType) &&
    (!filterPhase || claim.deliveryPhase === filterPhase) &&
    (!filterStatus || claim.status === filterStatus)
  );

  const priorityClaims = filteredDashboardClaims
    .sort((a, b) => {
      if (a.riskFlag === 'Overdue' && b.riskFlag !== 'Overdue') return -1;
      if (a.riskFlag !== 'Overdue' && b.riskFlag === 'Overdue') return 1;
      if (a.riskFlag === 'Due Soon' && b.riskFlag !== 'Due Soon') return -1;
      if (a.riskFlag !== 'Due Soon' && b.riskFlag === 'Due Soon') return 1;
      return 0;
    })
    .slice(0, 6);

  const contractorOptions = Array.from(new Set(claims.map(claim => claim.contractorName))).sort();
  const responsibilityOptions = Array.from(new Set(claims.map(claim => claim.responsibilityCode))).sort();
  const typeOptions = Array.from(new Set(claims.map(claim => claim.type))).sort();
  const statusOptions = Array.from(new Set(claims.map(claim => claim.status))).sort();

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Overdue') return 'bg-red-100 text-red-700';
    if (status === 'Due Soon') return 'bg-amber-100 text-amber-700';
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-slate-100 text-slate-700';
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-50 text-slate-600';
  };

  const getPackageColor = (phase: string) => {
    if (phase.includes('30402')) return 'bg-slate-100 text-slate-700';
    if (phase.includes('30403')) return 'bg-blue-100 text-blue-700';
    if (phase.includes('30404')) return 'bg-purple-100 text-purple-700';
    if (phase.includes('30405')) return 'bg-green-100 text-green-700';
    if (phase.includes('30406')) return 'bg-amber-100 text-amber-700';
    if (phase.includes('30407')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Live view of claims, variations, RFIs, deadlines, TBC gaps, and NZD value at risk across all Ecogas project packages.</p>
          </div>
          <button onClick={() => router.push('/submit-claim')} className="premium-button-primary">
            <Plus className="w-4 h-4" />
            Add New Claim
          </button>
        </div>

        {/* Summary Cards - Grid 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Active Contracts"
            value={totalContracts}
            icon={Users}
            variant="info"
            onClick={() => handleCardClick('totalContracts')}
            helpText="Across all 6 Ecogas packages"
          />
          <MetricCard
            label="Confirmed on Portal"
            value={confirmedContractors}
            icon={CheckCircle}
            variant="success"
            onClick={() => handleCardClick('confirmedContractors')}
            helpText={`${confirmedContractors}/${totalContracts} registered`}
          />
          <MetricCard
            label="Pre-processing CFO Unassigned"
            value={preProcessingCFOUnassigned}
            icon={AlertCircle}
            variant="danger"
            onClick={() => handleCardClick('cfoUnassigned')}
            helpText="Urgent: requires contractor assignment"
          />
          <MetricCard
            label="Commission-phase Gaps"
            value={commissionPhaseGaps}
            icon={Package}
            variant="warning"
            onClick={() => handleCardClick('commissionGaps')}
            helpText="TBC during project handover"
          />
        </div>

        {/* Summary Cards - Grid 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Open Claims & Variations"
            value={openClaims}
            icon={FileText}
            variant="info"
            onClick={() => handleCardClick('openClaims')}
            helpText="Awaiting approval or review"
          />
          <MetricCard
            label="Value at Risk"
            value={`$${(totalValueAtRisk / 1000000).toFixed(1)}m`}
            icon={DollarSign}
            variant="default"
            onClick={() => handleCardClick('valueAtRisk')}
            helpText="Total NZD exposure"
          />
          <MetricCard
            label="Overdue Items"
            value={overdueItems}
            icon={AlertCircle}
            variant="danger"
            onClick={() => handleCardClick('overdue')}
            helpText="Past response deadline"
          />
          <MetricCard
            label="Due Within 7 Days"
            value={dueSoon}
            icon={Clock}
            variant="warning"
            onClick={() => handleCardClick('dueSoon')}
            helpText="Response deadline approaching"
          />
        </div>

        {/* Summary Cards - Grid 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Approved This Month"
            value={approvedThisMonth}
            icon={CheckCircle}
            variant="success"
            onClick={() => handleCardClick('approved')}
            helpText="Recent approvals"
          />
          <MetricCard
            label="Rejected This Month"
            value={rejectedThisMonth}
            icon={XCircle}
            variant="danger"
            onClick={() => handleCardClick('rejected')}
            helpText="Recently rejected records"
          />
          <MetricCard
            label="Gap/TBC Urgent"
            value={urgentTBC}
            icon={AlertCircle}
            variant="danger"
            onClick={() => handleCardClick('urgentTBC')}
            helpText="Unassigned urgent gap records"
          />
          <MetricCard
            label="Gap/TBC Standard"
            value={gapTbcStandard}
            icon={Target}
            variant="default"
            onClick={() => handleCardClick('standardTBC')}
            helpText="Standard priority gap records"
          />
        </div>

        <div className="premium-panel p-5 space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dashboard Filters</h2>
              <p className="text-sm text-slate-600">Filter the priority queue by Ecogas package, responsibility, contractor, type, phase, and status.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterPackage('');
                setFilterResponsibility('');
                setFilterContractor('');
                setFilterType('');
                setFilterPhase('');
                setFilterStatus('');
              }}
              className="premium-button-secondary"
            >
              Clear Filters
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <select value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)} aria-label="Package filter">
              <option value="">All Packages</option>
              {mockPackages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>{pkg.id} - {pkg.name}</option>
              ))}
            </select>
            <select value={filterResponsibility} onChange={(e) => setFilterResponsibility(e.target.value)} aria-label="Responsibility filter">
              <option value="">All Responsibility</option>
              {responsibilityOptions.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <select value={filterContractor} onChange={(e) => setFilterContractor(e.target.value)} aria-label="Contractor filter">
              <option value="">All Contractors</option>
              {contractorOptions.map(contractor => (
                <option key={contractor} value={contractor}>{contractor}</option>
              ))}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Claim type filter">
              <option value="">All Types</option>
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} aria-label="Delivery phase filter">
              <option value="">All Phases</option>
              {deliveryPhases.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Status filter">
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="premium-panel p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Project Package Quick Access</h2>
            <p className="text-sm text-slate-600">Jump into any of the six Ecogas package records with responsibility code and current risk counts.</p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">
            {mockPackages.map(pkg => (
              <button
                type="button"
                key={pkg.id}
                onClick={() => router.push(`/packages?selected=${pkg.id}`)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-bold text-slate-950">{pkg.id}</p>
                <p className="text-xs text-slate-600 mt-1">{pkg.name}</p>
                <p className="mt-3 inline-flex rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-[#14533b]">{pkg.responsibilityCode}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Claims Queue */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Priority Claims Queue</h2>
            <p className="text-sm text-slate-600">Claims sorted by urgency and deadline</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Value NZD</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Deadline</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Risk</th>
                </tr>
              </thead>
              <tbody>
                {priorityClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/claim-detail/${claim.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-[#1b5e3f]">{claim.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPackageColor(claim.packageId)}`}>
                        {claim.packageId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{claim.contractorName}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.type}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${claim.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.deadline}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(claim.riskFlag)}`}>
                        {claim.riskFlag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-200">
            <Link href="/claims" className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm">
              View all claims →
            </Link>
          </div>
        </div>

        {/* Delivery Phase Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Delivery Phase Breakdown</h2>
            </div>
            <div className="space-y-3 p-6">
              {phaseBreakdown.map((phase) => (
                <div key={phase.phase} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">{phase.phase}</p>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1b5e3f] transition-all"
                        style={{ width: `${(phase.count / Math.max(...phaseBreakdown.map(p => p.count), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold text-slate-900">{phase.count}</p>
                    <p className="text-xs text-slate-500">${(phase.value / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            </div>
            <div className="space-y-4 p-6">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="w-2 h-2 bg-[#1b5e3f] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{item.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
