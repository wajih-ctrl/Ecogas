'use client';

import { create } from 'zustand';
import { UserRole, Claim, TBCGap, CommissionGap, User, NotificationItem } from './types';
import { mockClaims, mockTBCGaps, mockCommissionGaps, mockUsers, contractorPackages } from './mock-data';

interface AppState {
  currentRole: UserRole | null;
  selectedContractor: string | null;
  currentUser: User | null;
  claims: Claim[];
  tbcGaps: TBCGap[];
  commissionGaps: CommissionGap[];
  users: User[];
  notifications: NotificationItem[];
  
  setRole: (role: UserRole) => void;
  setContractor: (contractor: string) => void;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  addClaim: (claim: Claim) => void;
  
  updateTBCGap: (id: string, updates: Partial<TBCGap>) => void;
  updateCommissionGap: (id: string, updates: Partial<CommissionGap>) => void;
  
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useAppState = create<AppState>((set, get) => ({
  currentRole: null,
  selectedContractor: null,
  currentUser: null,
  claims: [...mockClaims],
  tbcGaps: [...mockTBCGaps],
  commissionGaps: [...mockCommissionGaps],
  users: [...mockUsers],
  notifications: [],

  setRole: (role: UserRole) => {
    set({ currentRole: role });
    if (role !== 'contractor') {
      set({ selectedContractor: null });
    }
  },

  setContractor: (contractor: string) => {
    set({ selectedContractor: contractor });
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
  },

  logout: () => {
    set({
      currentRole: null,
      selectedContractor: null,
      currentUser: null,
    });
  },

  updateClaim: (id: string, updates: Partial<Claim>) => {
    set((state) => ({
      claims: state.claims.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              ...updates,
              auditTrail: [
                ...claim.auditTrail,
                {
                  timestamp: new Date().toISOString().split('T')[0],
                  user: state.currentUser?.name || 'System',
                  action: updates.status ? `Status changed to ${updates.status}` : 'Updated',
                  details: 'Inline update',
                },
              ],
            }
          : claim
      ),
    }));
  },

  addClaim: (claim: Claim) => {
    set((state) => ({
      claims: [...state.claims, claim],
    }));
  },

  updateTBCGap: (id: string, updates: Partial<TBCGap>) => {
    set((state) => ({
      tbcGaps: state.tbcGaps.map((gap) =>
        gap.id === id ? { ...gap, ...updates } : gap
      ),
    }));
  },

  updateCommissionGap: (id: string, updates: Partial<CommissionGap>) => {
    set((state) => ({
      commissionGaps: state.commissionGaps.map((gap) =>
        gap.id === id ? { ...gap, ...updates } : gap
      ),
    }));
  },

  addUser: (user: User) => {
    set((state) => ({
      users: [...state.users, user],
    }));
  },

  updateUser: (id: string, updates: Partial<User>) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    }));
  },

  addNotification: (notification: Omit<NotificationItem, 'id'>) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `notif-${Date.now()}`,
        },
      ],
    }));
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  },
}));
