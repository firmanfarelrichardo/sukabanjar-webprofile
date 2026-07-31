'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface EditModalConfig {
  sectionKey: 'hero' | 'visionMission' | 'history' | 'apparatus' | 'contact';
  title: string;
  initialData: Record<string, any>;
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  editModalConfig: EditModalConfig | null;
  openEditModal: (config: EditModalConfig) => void;
  closeEditModal: () => void;
  isInboxOpen: boolean;
  openInboxModal: () => void;
  closeInboxModal: () => void;
  isExitModalOpen: boolean;
  openExitModal: () => void;
  closeExitModal: () => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  liveTextChanges: Record<string, any>;
  updateLiveText: (key: string, value: any) => void;
  clearLiveTextChanges: () => void;
}

const defaultAdminContext: AdminContextType = {
  isAdmin: false,
  setIsAdmin: () => {},
  isEditMode: false,
  setIsEditMode: () => {},
  editModalConfig: null,
  openEditModal: () => {},
  closeEditModal: () => {},
  isInboxOpen: false,
  openInboxModal: () => {},
  closeInboxModal: () => {},
  isExitModalOpen: false,
  openExitModal: () => {},
  closeExitModal: () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
  liveTextChanges: {},
  updateLiveText: () => {},
  clearLiveTextChanges: () => {},
};

const AdminContext = createContext<AdminContextType>(defaultAdminContext);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [editModalConfig, setEditModalConfig] = useState<EditModalConfig | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [liveTextChanges, setLiveTextChanges] = useState<Record<string, any>>({});

  // Cek status login admin dari cookie/endpoint
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        setIsAdmin(false);
      }
    }
    checkAuth();
  }, [refreshTrigger]);

  const openEditModal = (config: EditModalConfig) => {
    setEditModalConfig(config);
  };

  const closeEditModal = () => {
    setEditModalConfig(null);
  };

  const openInboxModal = () => {
    setIsInboxOpen(true);
  };

  const closeInboxModal = () => {
    setIsInboxOpen(false);
  };

  const openExitModal = () => {
    setIsExitModalOpen(true);
  };

  const closeExitModal = () => {
    setIsExitModalOpen(false);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const updateLiveText = (key: string, value: any) => {
    setLiveTextChanges((prev) => ({ ...prev, [key]: value }));
  };

  const clearLiveTextChanges = () => {
    setLiveTextChanges({});
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        isEditMode,
        setIsEditMode,
        editModalConfig,
        openEditModal,
        closeEditModal,
        isInboxOpen,
        openInboxModal,
        closeInboxModal,
        isExitModalOpen,
        openExitModal,
        closeExitModal,
        unreadCount,
        setUnreadCount,
        refreshTrigger,
        triggerRefresh,
        liveTextChanges,
        updateLiveText,
        clearLiveTextChanges,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  return context || defaultAdminContext;
}
