'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppState } from '@/lib/use-app-state';
import { useRouter } from 'next/navigation';

export default function ClaimsQueuePage() {
  const router = useRouter();
  const { claims } = useAppState();

  const queuedClaims = claims.filter(c => ['Submitted', 'Under Review', 'More Info Requested'].includes(c.status));

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Under Review') return 'bg-blue-100 text-blue-700';
    if (status === 'More Info Requested') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Claims Queue</h1>
          <p className="text-slate-600">Claims awaiting review or response</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Claim ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Contractor</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {queuedClaims.map(claim => (
                  <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-[#1b5e3f]">{claim.id}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.contractorName}</td>
                    <td className="px-6 py-4 text-slate-600">{claim.packageId}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${claim.value.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => router.push(`/claim-detail/${claim.id}`)} className="text-[#1b5e3f] hover:text-[#0d3a24] font-medium text-sm">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
