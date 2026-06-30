'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Clipboard, Gauge, LockKeyhole, Shield, Wrench } from 'lucide-react';
import { PremiumSelect } from '@/components/ui/premium-select';
import { contractors } from '@/lib/mock-data';
import { useAppState } from '@/lib/use-app-state';
import { User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { setRole, setCurrentUser, setContractor } = useAppState();
  const [selectedContractor, setSelectedContractor] = useState('');

  const handleAdminLogin = () => {
    const user: User = {
      id: 'admin-1',
      name: 'Alzbeta',
      email: 'alzbeta@ecogas.com',
      role: 'admin',
      roleType: 'Ecogas Staff',
      permissionRole: 'admin',
      status: 'active',
    };
    setCurrentUser(user);
    setRole('admin');
    router.push('/dashboard');
  };

  const handleConstructionManagerLogin = () => {
    const user: User = {
      id: 'cm-1',
      name: 'Sarah Chen',
      email: 'sarah@ecogas.com',
      role: 'construction-manager',
      roleType: 'Ecogas Staff',
      permissionRole: 'construction-manager',
      status: 'active',
    };
    setCurrentUser(user);
    setRole('construction-manager');
    router.push('/action-dashboard');
  };

  const handleContractorLogin = () => {
    if (!selectedContractor) return;
    const user: User = {
      id: `contractor-${selectedContractor}`,
      name: selectedContractor,
      email: `contact@${selectedContractor.toLowerCase().replace(/[^a-z0-9]+/g, '')}.co.nz`,
      role: 'contractor',
      contractor: selectedContractor,
      roleType: 'Construction Contractor',
      permissionRole: 'contractor',
      status: 'active',
    };
    setCurrentUser(user);
    setRole('contractor');
    setContractor(selectedContractor);
    router.push('/my-dashboard');
  };

  const badges = [
    { label: 'Ecogas Christchurch', icon: Building2 },
    { label: 'Role-Based Access', icon: LockKeyhole },
    { label: 'NZD Value at Risk', icon: Gauge },
  ];

  return (
    <div className="min-h-screen bg-[#071710] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,83,59,0.48),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(15,118,110,0.22),transparent_30%)]" />

      <main className="relative z-10 min-h-screen grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center px-6 py-10 md:px-10">
        <section className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50 shadow-xl backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Mock Prototype
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white text-[#14533b] flex items-center justify-center font-black shadow-2xl">
              CF
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-100">ClaimFlow</p>
              <p className="text-xs text-slate-300">Ecogas Christchurch</p>
            </div>
          </div>

          <h1 className="mt-10 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            ClaimFlow
            <span className="block text-emerald-100">Ecogas Christchurch Project Control Portal</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-8 text-slate-200 max-w-xl">
            One source of truth for contractor claims, variations, RFIs, design changes, deadlines, TBC risks, and NZD value at risk.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {badges.map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-50 backdrop-blur">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="w-full">
          <div className="rounded-3xl border border-white/15 bg-white/[0.96] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
            <div className="p-5 md:p-7 border-b border-slate-200">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#14533b]">Select portal view</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Continue as</h2>
            </div>

            <div className="grid gap-4 p-5 md:p-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#14533b]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-950">Ecogas Admin</h3>
                    <p className="text-slate-600 text-sm mt-1">CTO / Program Manager full project visibility</p>
                  </div>
                </div>
                <button onClick={handleAdminLogin} className="mt-5 w-full premium-button-primary">
                  Enter Admin Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-200 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Clipboard className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-950">Construction Manager</h3>
                    <p className="text-slate-600 text-sm mt-1">Day-to-day claims, deadlines, and contractor response queue</p>
                  </div>
                </div>
                <button onClick={handleConstructionManagerLogin} className="mt-5 w-full premium-button-secondary border-amber-200 text-amber-800 hover:bg-amber-50">
                  Enter Construction Manager View
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-200 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-950">Contractor / Supplier</h3>
                    <p className="text-slate-600 text-sm mt-1">Submit and track claims for assigned packages only</p>
                  </div>
                </div>
                <div className="space-y-3 mt-5">
                  <PremiumSelect
                    value={selectedContractor}
                    onChange={setSelectedContractor}
                    options={contractors.map(c => ({ value: c, label: c }))}
                    placeholder="Select contractor..."
                    className="text-slate-950"
                  />
                  <button
                    onClick={handleContractorLogin}
                    disabled={!selectedContractor}
                    className="w-full premium-button-secondary disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    Enter Contractor Portal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
