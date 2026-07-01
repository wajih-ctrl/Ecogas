'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Calendar, DollarSign, FileText, Check, X, AlertCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { mockPackages } from '@/lib/mock-data';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { claims, updateClaim } = useAppState();
  const claimId = params.id as string;
  const claim = claims.find(c => c.id === claimId);
  const [newStatus, setNewStatus] = useState(claim?.status || '');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showActionConfirm, setShowActionConfirm] = useState<string | null>(null);

  if (!claim) {
    return (
      <AppLayout>
        <div className="p-8">
          <p className="text-slate-600">Claim not found</p>
        </div>
      </AppLayout>
    );
  }

  const handleStatusChange = () => {
    if (newStatus && newStatus !== claim.status) {
      const newAuditEntry = {
        timestamp: new Date().toLocaleDateString(),
        user: 'Alzbeta',
        action: newStatus,
        details: `Status updated to ${newStatus}`,
      };
      updateClaim(claim.id, { 
        status: newStatus as any,
        auditTrail: [...claim.auditTrail, newAuditEntry]
      });
      setShowStatusModal(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (!claim) return;
    const newAuditEntry = {
      timestamp: new Date().toLocaleDateString(),
      user: 'Alzbeta',
      action: action,
      details: `${action} by admin`,
    };
    let newStatus = claim.status;
    if (action === 'Approve') newStatus = 'Approved';
    if (action === 'Reject') newStatus = 'Rejected';
    if (action === 'More Info') newStatus = 'More Info Requested';
    if (action === 'Review') newStatus = 'Under Review';
    if (action === 'Mark Overdue') newStatus = 'Overdue';
    
    updateClaim(claim.id, {
      status: newStatus as any,
      auditTrail: [...claim.auditTrail, newAuditEntry]
    });
    setShowActionConfirm(null);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'text-green-600';
    if (status === 'Rejected') return 'text-red-600';
    if (status === 'Overdue') return 'text-red-600';
    if (status === 'Under Review') return 'text-blue-600';
    return 'text-slate-600';
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'Approved') return 'bg-green-50 border-green-200';
    if (status === 'Rejected') return 'bg-red-50 border-red-200';
    if (status === 'Overdue') return 'bg-red-50 border-red-200';
    if (status === 'Under Review') return 'bg-blue-50 border-blue-200';
    return 'bg-slate-50 border-slate-200';
  };

  const packageJob = mockPackages
    .find(pkg => pkg.id === claim.packageId)
    ?.jobCodes.find(job => job.code === claim.jobCode || claim.jobCode.startsWith(job.code.split('-')[0]));
  const contractorRoleType = claim.contractorRoleType || packageJob?.roleType || 'Construction Contractor';
  const claimDescription = claim.description || claim.auditTrail[0]?.details || 'No additional description provided in this prototype record.';

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{claim.id}</h1>
            <p className="text-slate-600">{claim.packageName} / {claim.contractorName}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className={`rounded-lg border p-6 ${getStatusBgColor(claim.status)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Current Status</p>
                  <p className={`text-2xl font-bold ${getStatusColor(claim.status)}`}>{claim.status}</p>
                </div>
                <button
                  onClick={() => {
                    setNewStatus(claim.status);
                    setShowStatusModal(true);
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Claim Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Claim Type</p>
                <p className="text-lg font-semibold text-slate-900">{claim.type}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Job Code</p>
                <p className="text-lg font-semibold text-slate-900">{claim.jobCode}</p>
                <p className="text-sm text-slate-600 mt-1">{claim.jobDescription}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Delivery Phase</p>
                <p className="text-lg font-semibold text-slate-900">{claim.deliveryPhase}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Responsibility Code</p>
                <p className="text-lg font-semibold text-slate-900">{claim.responsibilityCode}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-sm leading-6 text-slate-700">{claimDescription}</p>
            </div>

            {/* Financial Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-slate-500">Claim Value</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">${claim.value.toLocaleString()} NZD</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-slate-500">Days Status</p>
                </div>
                <p className={`text-2xl font-bold ${claim.daysStatus > 0 ? 'text-slate-900' : 'text-red-600'}`}>
                  {claim.daysStatus > 0 ? `+${claim.daysStatus}` : claim.daysStatus}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Submitted Date</p>
                <p className="text-lg font-semibold text-slate-900">{claim.submitted}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-2">Response Deadline</p>
                <p className="text-lg font-semibold text-slate-900">{claim.deadline}</p>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Audit Trail</h3>
              <div className="space-y-4">
                {claim.auditTrail.map((event, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                    <div className="w-2 h-2 bg-[#1b5e3f] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{event.action}</p>
                      <p className="text-sm text-slate-600">{event.details}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>{event.user}</span>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            {claim.documents.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Attachments</h3>
                <div className="space-y-2">
                  {claim.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-900">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickAction('Approve')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleQuickAction('Reject')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleQuickAction('More Info')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  More Info
                </button>
                <button
                  onClick={() => handleQuickAction('Review')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Review
                </button>
                <button
                  onClick={() => {
                    setNewStatus(claim.status);
                    setShowStatusModal(true);
                  }}
                  className="col-span-2 px-4 py-3 bg-[#1b5e3f] hover:bg-[#0d3a24] text-white font-medium rounded-lg transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => router.back()}
                  className="col-span-2 px-4 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contractor Info */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Contractor Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Contractor</p>
                  <p className="font-medium text-slate-900">{claim.contractorName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Role Type</p>
                  <p className="font-medium text-slate-900">{contractorRoleType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Package</p>
                  <p className="font-medium text-slate-900">{claim.packageId}</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Owner</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="font-medium text-slate-900">{claim.owner}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Role</p>
                  <p className="font-medium text-slate-900">{claim.ownerRole}</p>
                </div>
              </div>
            </div>

            {/* Risk Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Risk Assessment</h3>
              <div>
                <p className="text-xs text-slate-500 mb-2">Risk Flag</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {claim.riskFlag}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Change Modal */}
        {showStatusModal && (
          <div className="modal-shell">
            <div className="modal-card max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Update Claim Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="More Info Requested">More Info Requested</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusChange}
                    className="flex-1 px-4 py-2 bg-[#1b5e3f] hover:bg-[#0d3a24] text-white font-medium rounded-lg transition-colors"
                  >
                    Update
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
