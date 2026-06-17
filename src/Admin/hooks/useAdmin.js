import { useCallback, useEffect, useMemo, useState } from 'react';
import { initialAdminData } from '../data/mockAdminData';

const STORAGE_KEY = 'adminPanelState';

const createInitialSnapshot = () => initialAdminData;

const persistSnapshot = (snapshot) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};

const useAdmin = () => {
  const [snapshot, setSnapshot] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : createInitialSnapshot();
    } catch {
      return createInitialSnapshot();
    }
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    persistSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone });
  }, []);

  const updateData = useCallback((key, updater) => {
    setSnapshot((current) => {
      const nextValue = typeof updater === 'function' ? updater(current[key]) : updater;
      const next = { ...current, [key]: nextValue };
      persistSnapshot(next);
      return next;
    });
  }, []);

  const addActivityLog = useCallback((entry) => {
    updateData('activityLogs', (current) => [
      {
        id: `log_${Date.now()}`,
        userId: entry.userId || null,
        actor: entry.actor || 'Admin',
        action: entry.action,
        target: entry.target || 'Admin panel',
        timestamp: entry.timestamp || 'Just now',
        date: entry.date || new Date().toISOString(),
        severity: entry.severity || 'info'
      },
      ...current
    ]);
  }, [updateData]);

  const resetDemoData = useCallback(() => {
    const initial = createInitialSnapshot();
    setSnapshot(initial);
    persistSnapshot(initial);
    showToast('Demo admin data reset.');
  }, [showToast]);

  const stats = useMemo(() => {
    const totalUsers = snapshot.users.length;
    const activeUsers = snapshot.users.filter((user) => user.status === 'active').length;
    const totalStorage = snapshot.users.reduce((sum, user) => sum + user.storageUsed, 0);
    const totalStorageLimit = snapshot.users.reduce((sum, user) => sum + user.storageLimit, 0);
    const totalRevenue = snapshot.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidRevenue = snapshot.payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalUsers,
      activeUsers,
      totalStorage,
      totalStorageLimit,
      storageUsedPercent: totalStorageLimit ? (totalStorage / totalStorageLimit) * 100 : 0,
      totalRevenue,
      paidRevenue,
      alerts: snapshot.alerts.length,
      activityCount: snapshot.activityLogs.length
    };
  }, [snapshot]);

  const data = snapshot;
  const clearToast = useCallback(() => setToast(null), []);

  return {
    data,
    snapshot,
    setSnapshot,
    stats,
    sidebarCollapsed,
    setSidebarCollapsed,
    theme,
    setTheme,
    toast,
    clearToast,
    showToast,
    updateData,
    addActivityLog,
    resetDemoData
  };
};

export default useAdmin;
