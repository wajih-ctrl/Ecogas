'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useEffect, useState } from 'react';
import { contractors, mockPackages } from '@/lib/mock-data';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TBCRisksPage() {
  const { tbcGaps, updateTBCGap } = useAppState();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGapId, setSelectedGapId] = useState<string | null>(null);
  const [selectedContractor, setSelectedContractor] = useState('');

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('section');
    if (section) {
      window.setTimeout(() => {
        document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, []);

  const handleAssignContractor = () => {
    if (selectedGapId && selectedContractor) {
      const gap = tbcGaps.find(g => g.id === selectedGapId);
      if (gap) {
        updateTBCGap(selectedGapId, { supplyContractor: selectedContractor });
        setShowAssignModal(false);
        setSelectedGapId(null);
        setSelectedContractor('');
      }
    }
  };

  // Section 1: Pre-processing CFO Fully Unassigned (top priority)
  const preProcessingCFO = tbcGaps.filter(g => g.jobCode.includes('CFO'));
  
  // Section 2: Gap/TBC Urgent (unconfirmed contractor, urgent)
  const gapTbcUrgent = tbcGaps.filter(g => !g.jobCode.includes('CFO') && !g.jobCode.includes('-C') && g.riskLevel === 'Urgent');
  
  // Section 3: Gap/TBC Standard (unconfirmed contractor, not urgent)
  const gapTbcStandard = tbcGaps.filter(g => !g.jobCode.includes('CFO') && !g.jobCode.includes('-C') && g.riskLevel === 'Standard');
  
  // Section 4: Commission-phase TBC (supply confirmed, commission contractor TBC)
  const commissionPhaseTBC = tbcGaps.filter(g => g.jobCode.includes('-C') && !g.commissionContractor);

  const getResponsibilityCode = (packageId: string) =>
    mockPackages.find(pkg => pkg.id === packageId)?.responsibilityCode || 'TBC';

  const getGapType = (gap: typeof tbcGaps[number]) => {
    if (gap.jobCode.includes('CFO')) return 'Fully Unassigned';
    if (gap.jobCode.includes('-C')) return 'Commission-phase TBC';
    return gap.riskLevel === 'Urgent' ? 'Gap/TBC Urgent' : 'Gap/TBC Standard';
  };

  const renderGapsTable = (gaps: typeof tbcGaps, title: string, bgColor: string, headerColor: string, icon: React.ReactNode, sectionId: string) => (
    <div id={`section-${sectionId}`} className={`${bgColor} rounded-lg border overflow-hidden mt-6 scroll-mt-24`}>
      <div className={`p-6 border-b`}>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="text-lg font-bold text-slate-900">{title} ({gaps.length})</h3>
        </div>
        <p className="text-sm text-slate-700 ml-9">Contractor assignment required</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={`${headerColor} border-b`}>
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Package</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Resp.</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Job Code</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Scope</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Phase(s)</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Supply Contractor</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Commission Contractor</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Gap Type</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap) => (
              <tr key={gap.id} className="border-b border-slate-100 hover:bg-white bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{gap.packageId}</td>
                <td className="px-6 py-4 text-slate-600">{getResponsibilityCode(gap.packageId)}</td>
                <td className="px-6 py-4 text-slate-600">{gap.jobCode}</td>
                <td className="px-6 py-4 text-slate-700">{gap.scope}</td>
                <td className="px-6 py-4 text-slate-600">{gap.deliveryPhase}</td>
                <td className="px-6 py-4 text-slate-600">{gap.supplyContractor || <span className="text-red-600 font-semibold">Unassigned</span>}</td>
                <td className="px-6 py-4">
                  <span className={gap.commissionContractor ? 'text-slate-600' : 'text-purple-600 font-semibold'}>
                    {gap.commissionContractor || 'TBC'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${gap.riskLevel === 'Urgent' ? 'bg-red-200 text-red-700' : 'bg-slate-300 text-slate-700'}`}>
                    {getGapType(gap)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {!gap.supplyContractor && (
                    <button
                      onClick={() => {
                        setSelectedGapId(gap.id);
                        setShowAssignModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">TBC Risk View</h1>
          <p className="text-slate-600 mb-2">Unassigned contractor scopes are surfaced as live project risks before they become schedule or financial surprises.</p>
          <p className="text-sm text-slate-500">TBC = "To Be Confirmed". Assign contractors rapidly and set contract values for all unresolved packages to eliminate project delivery risk.</p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button type="button" onClick={() => document.getElementById('section-cfo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="clickable-card border-red-200 bg-red-50">
            <p className="text-xs text-red-700 mb-2 font-semibold">Pre-processing CFO Unassigned</p>
            <p className="text-3xl font-bold text-red-700">{preProcessingCFO.length}</p>
          </button>
          <button type="button" onClick={() => document.getElementById('section-urgent')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="clickable-card border-orange-200 bg-orange-50">
            <p className="text-xs text-orange-700 mb-2 font-semibold">Gap/TBC Urgent</p>
            <p className="text-3xl font-bold text-orange-700">{gapTbcUrgent.length}</p>
          </button>
          <button type="button" onClick={() => document.getElementById('section-standard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="clickable-card bg-slate-50">
            <p className="text-xs text-slate-600 mb-2 font-semibold">Gap/TBC Standard</p>
            <p className="text-3xl font-bold text-slate-900">{gapTbcStandard.length}</p>
          </button>
          <button type="button" onClick={() => document.getElementById('section-commission')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="clickable-card border-purple-200 bg-purple-50">
            <p className="text-xs text-purple-700 mb-2 font-semibold">Commission-phase TBC</p>
            <p className="text-3xl font-bold text-purple-700">{commissionPhaseTBC.length}</p>
          </button>
        </div>

        {/* SECTION 1: Pre-processing CFO Fully Unassigned (Top Priority) */}
        {preProcessingCFO.length > 0 && (
          <div id="section-cfo" className="bg-red-50 rounded-lg border-2 border-red-300 p-8 scroll-mt-24">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pre-processing CFO - Fully Unassigned</h3>
                <p className="text-slate-700 text-sm mt-1">Critical: No contractor assigned across Design, Supply, Construct, and Commission phases. Immediate action required.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-100 border-b border-red-300">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Equipment / Scope</th>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Package</th>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Resp.</th>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Phase(s)</th>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Contractor Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-red-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {preProcessingCFO.map((item) => (
                    <tr key={item.id} className="border-b border-red-100 bg-white hover:bg-red-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.scope}</td>
                      <td className="px-6 py-4 text-slate-600">{item.packageId}</td>
                      <td className="px-6 py-4 text-slate-600">{getResponsibilityCode(item.packageId)}</td>
                      <td className="px-6 py-4 text-slate-600">Design, Supply, Construct, Commission</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded text-xs font-bold bg-red-200 text-red-700">Fully Unassigned</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedGapId(item.id);
                            setShowAssignModal(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
                        >
                          Assign Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: Gap/TBC Urgent */}
        {gapTbcUrgent.length > 0 && renderGapsTable(gapTbcUrgent, 'Gap/TBC Urgent', 'bg-orange-50 border-orange-200', 'bg-orange-100 border-b border-orange-200', <AlertTriangle className="w-5 h-5 text-orange-600" />, 'urgent')}

        {/* SECTION 3: Gap/TBC Standard */}
        {gapTbcStandard.length > 0 && renderGapsTable(gapTbcStandard, 'Gap/TBC Standard', 'bg-slate-50 border-slate-200', 'bg-slate-100 border-b border-slate-200', <AlertCircle className="w-5 h-5 text-slate-600" />, 'standard')}

        {/* SECTION 4: Commission-phase TBC (Supply Confirmed, Commission TBC) */}
        {commissionPhaseTBC.length > 0 && renderGapsTable(commissionPhaseTBC, 'Commission-phase TBC', 'bg-purple-50 border-purple-200', 'bg-purple-100 border-b border-purple-200', <CheckCircle2 className="w-5 h-5 text-purple-600" />, 'commission')}

        {/* Assign Contractor Modal */}
        {showAssignModal && (
          <div className="modal-shell">
            <div className="modal-card max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Assign Contractor</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Select Contractor</label>
                  <select
                    value={selectedContractor}
                    onChange={(e) => setSelectedContractor(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="">Choose contractor...</option>
                    {contractors.map((contractor) => (
                      <option key={contractor} value={contractor}>
                        {contractor}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedGapId(null);
                      setSelectedContractor('');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignContractor}
                    disabled={!selectedContractor}
                    className="flex-1 px-4 py-2 bg-[#1b5e3f] hover:bg-[#0d3a24] disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
