'use client';

import { AppLayout } from '@/components/app-layout';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/use-app-state';
import { useState, useMemo } from 'react';
import { Plus, Upload } from 'lucide-react';
import { contractorPackages, contractors, mockPackages } from '@/lib/mock-data';

export default function SubmitClaimPage() {
  const router = useRouter();
  const { currentUser, currentRole, selectedContractor, addClaim } = useAppState();
  const [formData, setFormData] = useState({
    type: 'Claim',
    package: '',
    jobCode: '',
    deliveryPhase: '',
    value: '',
    description: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    owner: 'Sarah Chen',
    riskFlag: 'Submitted',
    contractor: '',
  });
  const [confirmation, setConfirmation] = useState('');

  const availablePackages = useMemo(() => {
    if (currentRole !== 'contractor') return mockPackages;
    const packageIds = contractorPackages[selectedContractor || ''] || [];
    return mockPackages.filter(pkg => packageIds.includes(pkg.id));
  }, [currentRole, selectedContractor]);

  // Get available job codes for selected package
  const availableJobCodes = useMemo(() => {
    if (!formData.package) return [];
    const pkg = availablePackages.find(p => p.id === formData.package);
    return pkg?.jobCodes || [];
  }, [availablePackages, formData.package]);

  // Get job code description
  const getJobCodeDescription = (code: string) => {
    const jobCode = availableJobCodes.find(jc => jc.code === code);
    return jobCode?.description || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.package || !formData.jobCode) {
      setConfirmation('Please select both package and job code before submitting.');
      return;
    }

    const pkg = availablePackages.find(p => p.id === formData.package);
    const jobCodeDesc = getJobCodeDescription(formData.jobCode);
    const jobCode = availableJobCodes.find(jc => jc.code === formData.jobCode);
    const contractorName = currentRole === 'contractor'
      ? selectedContractor || currentUser?.name || ''
      : formData.contractor || jobCode?.assignedContractor || '';

    const newClaim = {
      id: `CLM-${formData.package}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type: formData.type as any,
      packageId: formData.package,
      packageName: pkg?.name || '',
      responsibilityCode: pkg?.responsibilityCode || '',
      jobCode: formData.jobCode,
      jobDescription: jobCodeDesc,
      contractorId: currentUser?.id || '',
      contractorName,
      contractorRoleType: jobCode?.roleType || 'Construction Contractor',
      description: formData.description,
      deliveryPhase: (formData.deliveryPhase || 'Supply / Procurement') as any,
      value: parseInt(formData.value) || 0,
      submitted: new Date().toLocaleDateString('en-NZ', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
      deadline: formData.deadline,
      status: 'Submitted' as any,
      riskFlag: formData.riskFlag as any,
      owner: formData.owner,
      ownerRole: 'Construction Manager',
      daysStatus: 30,
      auditTrail: [
        { timestamp: new Date().toLocaleDateString(), user: currentUser?.name || '', action: 'Submitted', details: formData.description || 'Initial submission' },
      ],
      documents: ['receipt.pdf'],
    };

    addClaim(newClaim);
    setConfirmation('Claim submitted and added to the local prototype dashboards.');
    router.push(currentRole === 'contractor' ? '/my-dashboard' : '/claims');
  };

  const handleSaveDraft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.package || !formData.jobCode) {
      setConfirmation('Select a package and job code before saving a draft.');
      return;
    }
    const pkg = availablePackages.find(p => p.id === formData.package);
    const jobCode = availableJobCodes.find(jc => jc.code === formData.jobCode);
    const contractorName = currentRole === 'contractor'
      ? selectedContractor || currentUser?.name || ''
      : formData.contractor || jobCode?.assignedContractor || '';
    addClaim({
      id: `DRAFT-${formData.package}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: formData.type as any,
      packageId: formData.package,
      packageName: pkg?.name || '',
      responsibilityCode: pkg?.responsibilityCode || '',
      jobCode: formData.jobCode,
      jobDescription: getJobCodeDescription(formData.jobCode),
      contractorId: currentUser?.id || '',
      contractorName,
      contractorRoleType: jobCode?.roleType || 'Construction Contractor',
      description: formData.description,
      deliveryPhase: (formData.deliveryPhase || 'Supply / Procurement') as any,
      value: parseInt(formData.value) || 0,
      submitted: new Date().toISOString().split('T')[0],
      deadline: formData.deadline,
      status: 'Under Review' as any,
      riskFlag: 'Under Review',
      owner: formData.owner,
      ownerRole: 'Construction Manager',
      daysStatus: 30,
      auditTrail: [{ timestamp: new Date().toLocaleDateString(), user: currentUser?.name || '', action: 'Draft Saved', details: formData.description || 'Draft created' }],
      documents: [],
    });
    setConfirmation('Draft saved in local prototype state.');
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit New Claim</h1>
        <p className="text-slate-600 mb-8">
          {currentRole === 'contractor'
            ? `Create a new claim, variation order, or RFI for ${selectedContractor}'s assigned package(s).`
            : 'Create a new claim, variation order, or RFI.'}
        </p>
        {confirmation && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {confirmation}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Claim Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="Claim">Claim</option>
                <option value="VO">Variation Order</option>
                <option value="RFI">RFI</option>
                <option value="Design Change">Design Change</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Package</label>
                <select
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value, jobCode: '' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  required
                >
                  <option value="">Select package...</option>
                  {availablePackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.id} - {pkg.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Responsibility Code</label>
                <input
                  value={availablePackages.find(p => p.id === formData.package)?.responsibilityCode || ''}
                  readOnly
                  placeholder="Auto-populated"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Job Code</label>
                <select
                  value={formData.jobCode}
                  onChange={(e) => setFormData({ ...formData, jobCode: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  required
                  disabled={!formData.package}
                >
                  <option value="">
                    {formData.package ? 'Select job code...' : 'Select package first'}
                  </option>
                  {availableJobCodes.map(jc => (
                    <option key={jc.code} value={jc.code}>
                      {jc.code} - {jc.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Contractor</label>
                {currentRole === 'contractor' ? (
                  <input
                    value={selectedContractor || ''}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                  />
                ) : (
                  <select
                    value={formData.contractor}
                    onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Select contractor...</option>
                    {contractors.map(contractor => (
                      <option key={contractor} value={contractor}>{contractor}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Contractor Role Type</label>
                <input
                  value={availableJobCodes.find(jc => jc.code === formData.jobCode)?.roleType || ''}
                  readOnly
                  placeholder="Auto-populated from job code"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Delivery Phase</label>
              <select
                value={formData.deliveryPhase}
                onChange={(e) => setFormData({ ...formData, deliveryPhase: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
              >
                <option value="">Select delivery phase...</option>
                <option value="Design">Design</option>
                <option value="Supply / Procurement">Supply / Procurement</option>
                <option value="Construct">Construct</option>
                <option value="Commission">Commission</option>
                <option value="Handover Docs">Handover Docs</option>
                <option value="Compliance Docs">Compliance Docs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Value (NZD)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Submitted Date</label>
                <input value={new Date().toISOString().split('T')[0]} readOnly className="w-full bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Response Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Owner</label>
                <select
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full"
                >
                  <option>Sarah Chen</option>
                  <option>Mike Johnson</option>
                  <option>Alzbeta</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Urgency</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]">
                  <option>Standard</option>
                  <option>Urgent</option>
                  <option>Critical</option>
                </select>
              </div>
              {currentRole !== 'contractor' && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Gap Flag</label>
                  <select
                    value={formData.riskFlag}
                    onChange={(e) => setFormData({ ...formData, riskFlag: e.target.value })}
                    className="w-full"
                  >
                    <option value="Submitted">None</option>
                    <option value="Gap/TBC Standard">Gap/TBC Standard</option>
                    <option value="Gap/TBC Urgent">Gap/TBC Urgent</option>
                    <option value="Commission-phase TBC">Commission-phase TBC</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about this claim..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e3f] h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#1b5e3f] hover:bg-slate-50 transition-all">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">Drag and drop files or click to upload</p>
                <p className="text-xs text-slate-500 mt-1">PDF, Excel, Word documents supported</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 premium-button-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 premium-button-secondary"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="flex-1 premium-button-primary"
            >
              <Plus className="w-4 h-4" />
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
