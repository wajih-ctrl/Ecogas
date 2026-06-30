'use client';

import { AppLayout } from '@/components/app-layout';
import { mockPackages, contractors } from '@/lib/mock-data';
import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function PackagesPage() {
  const router = useRouter();
  const { claims } = useAppState();
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'contractors' | 'claims' | 'gaps' | 'activity'>('overview');
  const [modalOpen, setModalOpen] = useState<'contractor' | 'value' | 'tbc' | null>(null);
  const [selectedJobCode, setSelectedJobCode] = useState<string | null>(null);
  const [modalData, setModalData] = useState({ contractor: '', value: '', tbcType: 'Standard' });
  const [jobOverrides, setJobOverrides] = useState<Record<string, { assignedContractor?: string; contractValue?: number; gapFlag?: boolean; tbcType?: string }>>({});
  const [confirmation, setConfirmation] = useState('');

  const selectedPackage = mockPackages.find(p => p.id === (selectedPackageId || mockPackages[0].id));
  const selectedPackageClaims = claims.filter(claim => claim.packageId === selectedPackage?.id);
  const selectedPackageGapJobs = selectedPackage?.jobCodes.filter(job => job.gapFlag) || [];

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('selected');
    if (selected) setSelectedPackageId(selected);
  }, []);
  
  const handleAssignContractor = () => {
    if (selectedJobCode && modalData.contractor) {
      setJobOverrides(prev => ({
        ...prev,
        [selectedJobCode]: {
          ...prev[selectedJobCode],
          assignedContractor: modalData.contractor,
          gapFlag: false,
        },
      }));
      setConfirmation(`${modalData.contractor} assigned to ${selectedJobCode}.`);
      setModalOpen(null);
      setModalData({ contractor: '', value: '', tbcType: 'Standard' });
    }
  };

  const handleSetValue = () => {
    if (selectedJobCode && modalData.value) {
      setJobOverrides(prev => ({
        ...prev,
        [selectedJobCode]: {
          ...prev[selectedJobCode],
          contractValue: Number(modalData.value),
        },
      }));
      setConfirmation(`Contract value updated for ${selectedJobCode}.`);
      setModalOpen(null);
      setModalData({ contractor: '', value: '', tbcType: 'Standard' });
    }
  };

  const handleFlagTBC = () => {
    if (selectedJobCode) {
      setJobOverrides(prev => ({
        ...prev,
        [selectedJobCode]: {
          ...prev[selectedJobCode],
          gapFlag: true,
          tbcType: modalData.tbcType,
        },
      }));
      setConfirmation(`Job code ${selectedJobCode} flagged as Gap/TBC ${modalData.tbcType}.`);
      setModalOpen(null);
      setModalData({ contractor: '', value: '', tbcType: 'Standard' });
    }
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Packages Management</h1>
          <p className="text-slate-600 mb-1">Manage all 6 Ecogas construction packages, assign contractors, set contract values, and flag TBC gaps.</p>
          <p className="text-sm text-slate-500">Each package consists of multiple job codes that need contractor assignments and value confirmation before contract execution.</p>
        </div>
        {confirmation && (
          <div className="premium-panel border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {confirmation}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Package List */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Packages</h3>
            <div className="space-y-2">
              {mockPackages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedPackageId === pkg.id || (selectedPackageId === '' && pkg.id === mockPackages[0].id)
                      ? 'bg-[#1b5e3f] text-white'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <p className="font-medium">{pkg.id}</p>
                  <p className="text-xs opacity-75">{pkg.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Package Details */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedPackage.id}</h2>
              <p className="text-slate-600 mb-6">{selectedPackage.name}</p>

              <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {[
                  ['overview', 'Overview'],
                  ['jobs', 'Job Codes'],
                  ['contractors', 'Contractors'],
                  ['claims', 'Claims & Variations'],
                  ['gaps', 'TBC / Gaps'],
                  ['activity', 'Activity'],
                ].map(([id, label]) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                      activeTab === id
                        ? 'bg-[#14533b] text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Responsibility Code</p>
                  <p className="font-semibold text-slate-900">{selectedPackage.responsibilityCode}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Open Claims</p>
                  <p className="font-semibold text-slate-900">{selectedPackage.openClaims}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Value at Risk</p>
                  <p className="font-semibold text-slate-900">${(selectedPackage.valueAtRisk / 1000).toFixed(0)}k</p>
                </div>
              </div>}
            </div>

            {/* Job Codes */}
            {activeTab === 'jobs' && <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Job Codes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Code</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Description</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Phase</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Role Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Value</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Claims</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Risk</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPackage.jobCodes.map(code => {
                      const override = jobOverrides[code.code] || {};
                      const assignedContractor = override.assignedContractor ?? code.assignedContractor ?? 'TBC';
                      const contractValue = override.contractValue ?? code.contractValue;
                      const gapFlag = override.gapFlag ?? code.gapFlag;
                      return (
                      <tr key={code.code} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{code.code}</td>
                        <td className="px-6 py-4 text-slate-600">{code.description}</td>
                        <td className="px-6 py-4 text-slate-600">{code.deliveryPhase}</td>
                        <td className="px-6 py-4 text-slate-600">{assignedContractor}</td>
                        <td className="px-6 py-4 text-slate-600">{code.roleType}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">${contractValue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">{code.openClaims}</td>
                        <td className="px-6 py-4">
                          {gapFlag ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">{override.tbcType ? `Gap/TBC ${override.tbcType}` : 'Gap/TBC'}</span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => { setSelectedJobCode(code.code); setModalOpen('contractor'); }}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => { setSelectedJobCode(code.code); setModalOpen('value'); }}
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors"
                          >
                            Value
                          </button>
                          <button
                            onClick={() => { setSelectedJobCode(code.code); setModalOpen('tbc'); }}
                            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 rounded transition-colors"
                          >
                            Flag TBC
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>}

            {/* Contractors */}
            {activeTab === 'contractors' && <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Assigned Contractors</h3>
                <p className="text-sm text-slate-600 mt-1">Contractor cards show role type and scope coverage without hidden text or decorative blobs.</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedPackage.contractors.map(contractor => (
                    <div
                      key={contractor}
                      title={contractor}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-9 w-9 rounded-xl bg-emerald-50 text-[#14533b] flex items-center justify-center text-xs font-black">
                          {contractor.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-950 group-hover:text-[#14533b] transition-colors break-words">
                            {contractor}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {selectedPackage.jobCodes.filter(job => job.assignedContractor === contractor).length || 1} assigned scope(s)
                          </p>
                          <span className="mt-2 inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#14533b]">
                            {selectedPackage.jobCodes.find(job => job.assignedContractor === contractor)?.roleType || 'Contractor'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>}

            {activeTab === 'claims' && (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">Claims & Variations</h3>
                  <p className="text-sm text-slate-600 mt-1">All logged claims tied to package {selectedPackage.id}.</p>
                </div>
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Claim ID</th>
                        <th>Type</th>
                        <th>Contractor</th>
                        <th>Job Code</th>
                        <th>Value NZD</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPackageClaims.map(claim => (
                        <tr key={claim.id} onClick={() => router.push(`/claim-detail/${claim.id}`)} className="cursor-pointer">
                          <td className="font-semibold text-[#14533b]">{claim.id}</td>
                          <td>{claim.type}</td>
                          <td>{claim.contractorName}</td>
                          <td>{claim.jobCode}</td>
                          <td>${claim.value.toLocaleString()}</td>
                          <td>{claim.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedPackageClaims.length === 0 && (
                  <div className="p-6 text-sm text-slate-600">No claims logged for this package yet.</div>
                )}
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">TBC / Gaps</h3>
                  <p className="text-sm text-slate-600 mt-1">Package-level gap flags and unresolved ownership risks.</p>
                </div>
                <div className="p-6 space-y-3">
                  {selectedPackage.id === '30404' && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="font-bold text-red-900">Pre-processing CFO Fully Unassigned</p>
                      <p className="text-sm text-red-700 mt-1">Loader, Forklift, Irrigation, Depacker, Screw Press, Skip Bin, Magnet Box, Pump, Macerator, Bunkers, and Support Structures.</p>
                    </div>
                  )}
                  {selectedPackageGapJobs.map(job => (
                    <div key={job.code} className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <p className="font-semibold text-slate-950">{job.code} - {job.description}</p>
                      <p className="text-sm text-slate-700 mt-1">{job.deliveryPhase} / {job.roleType}</p>
                    </div>
                  ))}
                  {selectedPackageGapJobs.length === 0 && selectedPackage.id !== '30404' && (
                    <p className="text-sm text-slate-600">No TBC gaps flagged in this package summary.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Activity</h3>
                <div className="space-y-4">
                  {[
                    `${selectedPackage.id} package opened by Ecogas Admin`,
                    `${selectedPackageClaims.length} claims linked to this package`,
                    `${selectedPackageGapJobs.length} TBC / gap job code flags currently visible`,
                  ].map((activity, index) => (
                    <div key={activity} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                      <div className="mt-1 h-2 w-2 rounded-full bg-[#14533b]" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{activity}</p>
                        <p className="text-xs text-slate-500">{index + 1} hour(s) ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modals */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
              {/* Assign Contractor Modal */}
              {modalOpen === 'contractor' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Assign Contractor to {selectedJobCode}</h3>
                    <button onClick={() => setModalOpen(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Select Contractor</label>
                      <select
                        value={modalData.contractor}
                        onChange={(e) => setModalData({ ...modalData, contractor: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                      >
                        <option value="">Choose contractor...</option>
                        {contractors.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setModalOpen(null)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAssignContractor}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Set Value Modal */}
              {modalOpen === 'value' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Set Contract Value</h3>
                    <button onClick={() => setModalOpen(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Value (NZD)</label>
                      <input
                        type="number"
                        value={modalData.value}
                        onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setModalOpen(null)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSetValue}
                        className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg"
                      >
                        Set Value
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Flag TBC Modal */}
              {modalOpen === 'tbc' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Flag as Gap/TBC</h3>
                    <button onClick={() => setModalOpen(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">TBC Type</label>
                      <select
                        value={modalData.tbcType}
                        onChange={(e) => setModalData({ ...modalData, tbcType: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                      >
                        <option value="Standard">Gap/TBC Standard</option>
                        <option value="Urgent">Gap/TBC Urgent</option>
                        <option value="Commission">Commission-phase TBC</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setModalOpen(null)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFlagTBC}
                        className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg"
                      >
                        Flag as TBC
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
