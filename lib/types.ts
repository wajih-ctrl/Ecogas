export type UserRole = 'admin' | 'construction-manager' | 'contractor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  contractor?: string;
  roleType?: string;
  permissionRole?: UserRole | string;
  assignedPackages?: string[];
  status: 'active' | 'inactive';
}

export type ClaimType = 'Claim' | 'VO' | 'RFI' | 'EOT' | 'Design Change';
export type ClaimStatus = 'Submitted' | 'Under Review' | 'More Info Requested' | 'Approved' | 'Rejected' | 'Overdue';
export type DeliveryPhase = 'Design' | 'Supply / Procurement' | 'Construct' | 'Commission' | 'Handover Docs' | 'Compliance Docs';
export type RiskFlag = 'Overdue' | 'Due Soon' | 'Gap/TBC Urgent' | 'Commission-phase TBC' | 'Gap/TBC Standard' | 'Approved' | 'Rejected' | 'Under Review' | 'Submitted' | 'None';

export interface Claim {
  id: string;
  type: ClaimType;
  packageId: string;
  packageName: string;
  responsibilityCode: string;
  jobCode: string;
  jobDescription: string;
  contractorId: string;
  contractorName: string;
  contractorRoleType?: string;
  description?: string;
  deliveryPhase: DeliveryPhase;
  value: number;
  submitted: string;
  deadline: string;
  status: ClaimStatus;
  riskFlag: RiskFlag;
  owner: string;
  ownerRole: string;
  daysStatus: number;
  auditTrail: AuditEvent[];
  documents: string[];
}

export interface AuditEvent {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Package {
  id: string;
  name: string;
  responsibilityCode: string;
  contractors: string[];
  jobCodes: JobCode[];
  openClaims: number;
  valueAtRisk: number;
  tbcGaps: number;
  commissionGaps: number;
}

export interface JobCode {
  code: string;
  description: string;
  deliveryPhase: DeliveryPhase;
  assignedContractor?: string;
  roleType: string;
  contractValue: number;
  openClaims: number;
  gapFlag: boolean;
}

export interface TBCGap {
  id: string;
  packageId: string;
  packageName: string;
  jobCode: string;
  scope: string;
  supplyContractor?: string;
  commissionContractor?: string;
  deliveryPhase: DeliveryPhase;
  riskLevel: 'Standard' | 'Urgent';
}

export interface CommissionGap {
  id: string;
  packageId: string;
  packageName: string;
  jobCode: string;
  scope: string;
  supplyContractor: string;
  commissionContractor?: string;
  deliveryPhase: DeliveryPhase;
  riskLevel: 'Standard' | 'Urgent';
}

export interface NotificationItem {
  id: string;
  type: 'claim' | 'approval' | 'rejection' | 'assignment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}
