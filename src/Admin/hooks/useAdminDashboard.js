import { useCallback, useMemo, useState, useEffect } from 'react';
import { mockActivityLogs, mockAlerts, mockUsers } from '../data/mockAdminData';

const STORAGE_KEY = 'adminDashboardState';

const createInitialSnapshot = () => ({
  users: mockUsers,
  activityLogs: mockActivityLogs,
  alerts: mockAlerts
});

const persistSnapshot = (snapshot) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};

const useAdminDashboard = () => {
  const [snapshot, setSnapshot] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : createInitialSnapshot();
    } catch {
      return createInitialSnapshot();
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    persistSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone });
  }, []);

  const stats = useMemo(() => {
    const totalUsers = snapshot.users.length;
    const activeUsers = snapshot.users.filter((user) => user.status === 'active').length;
    const inactiveUsers = totalUsers - activeUsers;
    const downloadEnabled = snapshot.users.filter((user) => user.downloadPermission).length;
    const totalStorage = snapshot.users.reduce((total, user) => total + user.storageUsed, 0);
    const highRiskUsers = snapshot.users.filter((user) => user.risk === 'high').length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      downloadEnabled,
      downloadRestricted: totalUsers - downloadEnabled,
      totalStorage,
      highRiskUsers,
      alerts: snapshot.alerts.length,
      activityCount: snapshot.activityLogs.length
    };
  }, [snapshot]);

  const filteredUsers = useMemo(() => {
    return snapshot.users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.role, user.notes]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesPermission = permissionFilter === 'all' ||
        (permissionFilter === 'enabled' && user.downloadPermission) ||
        (permissionFilter === 'restricted' && !user.downloadPermission);

      return matchesSearch && matchesStatus && matchesPermission;
    });
  }, [snapshot.users, searchTerm, statusFilter, permissionFilter]);

  const recentActivity = useMemo(() => {
    return snapshot.activityLogs.slice(0, 8);
  }, [snapshot.activityLogs]);

  const toggleUserStatus = useCallback((userId) => {
    setSnapshot((current) => {
      const userToUpdate = current.users.find((user) => user.id === userId);
      const nextStatus = userToUpdate?.status === 'active' ? 'inactive' : 'active';

      const nextUsers = current.users.map((user) => {
        if (user.id !== userId) return user;

        return {
          ...user,
          status: nextStatus
        };
      });

      const changedUser = nextUsers.find((user) => user.id === userId);
      const nextLogs = [
        {
          id: `log_${Date.now()}`,
          userId,
          actor: 'Admin',
          action: `Account ${nextStatus === 'active' ? 'activated' : 'deactivated'}`,
          target: changedUser?.email || userId,
          timestamp: 'Just now',
          severity: nextStatus === 'active' ? 'success' : 'warning'
        },
        ...current.activityLogs
      ];

      return {
        ...current,
        users: nextUsers,
        activityLogs: nextLogs
      };
    });

    showToast('User account status updated.');
  }, [showToast]);

  const toggleDownloadPermission = useCallback((userId) => {
    setSnapshot((current) => {
      const nextUsers = current.users.map((user) => {
        if (user.id !== userId) return user;

        return {
          ...user,
          downloadPermission: !user.downloadPermission
        };
      });

      const changedUser = nextUsers.find((user) => user.id === userId);
      const nextLogs = [
        {
          id: `log_${Date.now()}`,
          userId,
          actor: 'Admin',
          action: changedUser?.downloadPermission ? 'Download permission enabled' : 'Download permission restricted',
          target: changedUser?.email || userId,
          timestamp: 'Just now',
          severity: changedUser?.downloadPermission ? 'success' : 'warning'
        },
        ...current.activityLogs
      ];

      return {
        ...current,
        users: nextUsers,
        activityLogs: nextLogs
      };
    });

    showToast('Download permission updated.');
  }, [showToast]);

  const deleteUser = useCallback((userId) => {
    setSnapshot((current) => {
      const removedUser = current.users.find((user) => user.id === userId);
      const nextLogs = [
        {
          id: `log_${Date.now()}`,
          userId,
          actor: 'Admin',
          action: 'User profile deleted',
          target: removedUser?.email || userId,
          timestamp: 'Just now',
          severity: 'critical'
        },
        ...current.activityLogs
      ];

      return {
        users: current.users.filter((user) => user.id !== userId),
        activityLogs: nextLogs,
        alerts: current.alerts.filter((alert) => alert.userId !== userId)
      };
    });

    setPendingDeleteUser(null);
    setSelectedUser(null);
    showToast('User profile deleted.', 'warning');
  }, [showToast]);

  const addAdminNote = useCallback((userId, note) => {
    setSnapshot((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.id !== userId) return user;

        return {
          ...user,
          notes: note || user.notes
        };
      }),
      activityLogs: [
        {
          id: `log_${Date.now()}`,
          userId,
          actor: 'Admin',
          action: 'Admin note updated',
          target: note,
          timestamp: 'Just now',
          severity: 'info'
        },
        ...current.activityLogs
      ]
    }));

    showToast('Admin note updated.');
  }, [showToast]);

  const resetDemoData = useCallback(() => {
    const initialSnapshot = createInitialSnapshot();
    setSnapshot(initialSnapshot);
    persistSnapshot(initialSnapshot);
    showToast('Demo admin data reset.');
  }, [showToast]);

  const exportReport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      stats,
      users: snapshot.users,
      activityLogs: snapshot.activityLogs,
      alerts: snapshot.alerts
    };

    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    showToast('Report summary copied to clipboard.');
  }, [showToast, stats, snapshot]);

  return {
    snapshot,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    permissionFilter,
    setPermissionFilter,
    filteredUsers,
    recentActivity,
    selectedUser,
    setSelectedUser,
    pendingDeleteUser,
    setPendingDeleteUser,
    toast,
    toggleUserStatus,
    toggleDownloadPermission,
    deleteUser,
    addAdminNote,
    resetDemoData,
    exportReport
  };
};

export default useAdminDashboard;
