export const mockUsers = [
  { id: 'usr_001', name: 'Amara Osei', email: 'amara.osei@example.com', role: 'Client', status: 'active', downloadPermission: true, storageUsed: 4.8, storageLimit: 10, uploads: 126, lastActive: '2 minutes ago', risk: 'low', notes: 'Premium wedding client', plan: 'Premium', location: 'Accra, Ghana', joinedAt: '2024-02-12' },
  { id: 'usr_002', name: 'Daniel Mensah', email: 'daniel.mensah@example.com', role: 'Photographer', status: 'active', downloadPermission: false, storageUsed: 18.2, storageLimit: 20, uploads: 412, lastActive: '1 hour ago', risk: 'medium', notes: 'Temporarily restricted from downloads', plan: 'Professional', location: 'Kumasi, Ghana', joinedAt: '2023-09-03' },
  { id: 'usr_003', name: 'Grace Agyeman', email: 'grace.agyeman@example.com', role: 'Client', status: 'inactive', downloadPermission: true, storageUsed: 1.4, storageLimit: 5, uploads: 34, lastActive: '12 days ago', risk: 'low', notes: 'Account paused by admin', plan: 'Free', location: 'Tema, Ghana', joinedAt: '2024-06-22' },
  { id: 'usr_004', name: 'Kwame Boateng', email: 'kwame.boateng@example.com', role: 'Assistant', status: 'active', downloadPermission: true, storageUsed: 9.6, storageLimit: 10, uploads: 248, lastActive: 'Yesterday', risk: 'high', notes: 'Unusual download activity detected', plan: 'Premium', location: 'Cape Coast, Ghana', joinedAt: '2023-11-18' },
  { id: 'usr_005', name: 'Nia Darko', email: 'nia.darko@example.com', role: 'Client', status: 'active', downloadPermission: true, storageUsed: 2.1, storageLimit: 10, uploads: 52, lastActive: '3 hours ago', risk: 'low', notes: 'Birthday shoot client', plan: 'Premium', location: 'Tamale, Ghana', joinedAt: '2024-08-07' },
  { id: 'usr_006', name: 'Samuel Tetteh', email: 'samuel.tetteh@example.com', role: 'Client', status: 'inactive', downloadPermission: false, storageUsed: 0.7, storageLimit: 5, uploads: 11, lastActive: '28 days ago', risk: 'medium', notes: 'Awaiting payment confirmation', plan: 'Free', location: 'Ho, Ghana', joinedAt: '2024-10-02' },
  { id: 'usr_007', name: 'Esi Amoah', email: 'esi.amoah@example.com', role: 'Editor', status: 'active', downloadPermission: true, storageUsed: 6.4, storageLimit: 15, uploads: 96, lastActive: '4 hours ago', risk: 'low', notes: 'Blog and gallery editor', plan: 'Professional', location: 'Accra, Ghana', joinedAt: '2023-05-14' },
  { id: 'usr_008', name: 'Malik Johnson', email: 'malik.johnson@example.com', role: 'Client', status: 'active', downloadPermission: true, storageUsed: 12.9, storageLimit: 15, uploads: 184, lastActive: 'Today', risk: 'medium', notes: 'Corporate event client', plan: 'Business', location: 'London, UK', joinedAt: '2022-12-11' }
];

export const mockRoles = [
  { id: 'role_admin', name: 'Admin', description: 'Full platform control', permissions: ['upload', 'download', 'edit', 'delete', 'manageUsers', 'manageContent', 'managePayments', 'viewAnalytics'], custom: false },
  { id: 'role_editor', name: 'Editor', description: 'Create and publish content', permissions: ['upload', 'download', 'edit', 'manageContent'], custom: false },
  { id: 'role_moderator', name: 'Moderator', description: 'Review uploads and reports', permissions: ['download', 'edit', 'manageContent'], custom: false },
  { id: 'role_premium', name: 'Premium', description: 'Paid client access', permissions: ['upload', 'download'], custom: false },
  { id: 'role_free', name: 'Free', description: 'Limited visitor access', permissions: ['download'], custom: false }
];

export const mockRolesPermissions = [
  { key: 'upload', label: 'Upload media' },
  { key: 'download', label: 'Download galleries' },
  { key: 'edit', label: 'Edit content' },
  { key: 'delete', label: 'Delete content' },
  { key: 'manageUsers', label: 'Manage users' },
  { key: 'manageContent', label: 'Manage content' },
  { key: 'managePayments', label: 'Manage payments' },
  { key: 'viewAnalytics', label: 'View analytics' }
];

export const mockActivityLogs = [
  { id: 'log_001', userId: 'usr_004', actor: 'Kwame Boateng', action: 'Download request', target: 'Portfolio Gallery', timestamp: '2 minutes ago', date: '2026-06-17T01:35:00', severity: 'warning' },
  { id: 'log_002', userId: 'usr_001', actor: 'Amara Osei', action: 'Gallery viewed', target: 'Wedding Highlights', timestamp: '8 minutes ago', date: '2026-06-17T01:30:00', severity: 'info' },
  { id: 'log_003', userId: 'usr_002', actor: 'Daniel Mensah', action: 'Upload batch', target: 'Brand Session', timestamp: '1 hour ago', date: '2026-06-17T00:38:00', severity: 'info' },
  { id: 'log_004', userId: 'usr_003', actor: 'Grace Agyeman', action: 'Login attempt blocked', target: 'Account access', timestamp: 'Yesterday', date: '2026-06-16T20:15:00', severity: 'critical' },
  { id: 'log_005', userId: 'usr_005', actor: 'Nia Darko', action: 'Downloaded album', target: 'Birthday Collection', timestamp: 'Yesterday', date: '2026-06-16T18:05:00', severity: 'success' },
  { id: 'log_006', userId: 'usr_007', actor: 'Esi Amoah', action: 'Published blog post', target: 'Accra Street Portraits', timestamp: 'Today', date: '2026-06-17T01:02:00', severity: 'success' }
];

export const mockAlerts = [
  { id: 'alert_001', title: 'High download activity', description: 'One user exceeded the expected download threshold today.', severity: 'warning', userId: 'usr_004' },
  { id: 'alert_002', title: 'Inactive accounts', description: 'Two accounts have been inactive for more than 21 days.', severity: 'info', userId: null },
  { id: 'alert_003', title: 'Blocked login attempt', description: 'A disabled account attempted to access the dashboard.', severity: 'critical', userId: 'usr_003' }
];

export const mockImages = [
  { id: 'img_001', title: 'Golden Hour Couple', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', user: 'Amara Osei', status: 'approved', featured: true, views: 1284, likes: 96, size: 3.2 },
  { id: 'img_002', title: 'Brand Studio Set', category: 'Commercial', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', user: 'Daniel Mensah', status: 'approved', featured: false, views: 842, likes: 42, size: 2.1 },
  { id: 'img_003', title: 'Birthday Candles', category: 'Events', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80', user: 'Nia Darko', status: 'approved', featured: true, views: 644, likes: 58, size: 1.4 },
  { id: 'img_004', title: 'Urban Fashion Editorial', category: 'Fashion', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', user: 'Esi Amoah', status: 'pending', featured: false, views: 312, likes: 19, size: 2.7 },
  { id: 'img_005', title: 'Family Lawn Session', category: 'Family', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80', user: 'Malik Johnson', status: 'approved', featured: false, views: 521, likes: 37, size: 1.9 }
];

export const mockFeaturedImages = [
  { id: 'feat_001', imageId: 'img_001', title: 'Golden Hour Couple', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', startDate: '2026-06-01', endDate: '2026-07-01', views: 1284, engagements: 196, ctr: 18.4 },
  { id: 'feat_002', imageId: 'img_003', title: 'Birthday Candles', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80', startDate: '2026-06-08', endDate: '2026-07-08', views: 644, engagements: 108, ctr: 14.2 },
  { id: 'feat_003', imageId: 'img_002', title: 'Brand Studio Set', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', startDate: '2026-06-12', endDate: '2026-07-12', views: 842, engagements: 124, ctr: 16.1 }
];

export const mockBlogPosts = [
  { id: 'post_001', title: 'How to Prepare for a Wedding Photo Session', slug: 'wedding-photo-session-preparation', excerpt: 'A practical guide for couples preparing for a studio or outdoor wedding shoot.', categories: ['Wedding', 'Tips'], tags: ['planning', 'wedding'], status: 'published', publishDate: '2026-05-20', seoTitle: 'Wedding Photo Session Preparation', seoDescription: 'Learn how to prepare for a beautiful wedding photo session.', seoKeywords: 'wedding photography, photo session, studio tips' },
  { id: 'post_002', title: 'Best Lighting for Family Portraits', slug: 'family-portrait-lighting-guide', excerpt: 'Simple lighting setups that make family portraits warm and timeless.', categories: ['Family', 'Education'], tags: ['lighting', 'portrait'], status: 'draft', publishDate: '2026-06-28', seoTitle: 'Family Portrait Lighting Guide', seoDescription: 'Discover lighting ideas for family portrait sessions.', seoKeywords: 'family portraits, lighting, photography' },
  { id: 'post_003', title: 'Behind the Scenes: Accra Street Portraits', slug: 'accra-street-portraits-behind-the-scenes', excerpt: 'A behind-the-scenes look at our latest street portrait editorial.', categories: ['Editorial', 'Behind the Scenes'], tags: ['accra', 'editorial'], status: 'scheduled', publishDate: '2026-06-22', seoTitle: 'Accra Street Portrait Editorial', seoDescription: 'Behind the scenes of an Accra street portrait editorial.', seoKeywords: 'accra, street portraits, editorial photography' }
];

export const mockCategories = [
  { id: 'cat_001', name: 'Wedding', parent: null, color: '#ef4444' },
  { id: 'cat_002', name: 'Engagement', parent: 'Wedding', color: '#f97316' },
  { id: 'cat_003', name: 'Commercial', parent: null, color: '#3b82f6' },
  { id: 'cat_004', name: 'Events', parent: null, color: '#a855f7' },
  { id: 'cat_005', name: 'Family', parent: null, color: '#10b981' }
];

export const mockTags = [
  { id: 'tag_001', name: 'planning', count: 12 },
  { id: 'tag_002', name: 'wedding', count: 28 },
  { id: 'tag_003', name: 'lighting', count: 16 },
  { id: 'tag_004', name: 'portrait', count: 24 },
  { id: 'tag_005', name: 'accra', count: 19 }
];

export const mockPendingApprovals = [
  { id: 'appr_001', imageId: 'img_004', title: 'Urban Fashion Editorial', user: 'Esi Amoah', category: 'Fashion', submittedAt: '2026-06-17T00:40:00', reason: 'New fashion editorial batch', status: 'pending' },
  { id: 'appr_002', imageId: 'img_006', title: 'Graduation Portraits', user: 'Samuel Tetteh', category: 'Events', submittedAt: '2026-06-16T19:22:00', reason: 'Graduation gallery upload', status: 'pending' }
];

export const mockReportedContent = [
  { id: 'rep_001', contentId: 'img_002', title: 'Brand Studio Set', reporter: 'Moderator', reason: 'Possible copyright concern', status: 'open', date: '2026-06-16T22:10:00', resolution: '' },
  { id: 'rep_002', contentId: 'post_002', title: 'Best Lighting for Family Portraits', reporter: 'Client', reason: 'Outdated information', status: 'reviewing', date: '2026-06-15T15:30:00', resolution: '' }
];

export const mockPayments = [
  { id: 'pay_001', user: 'Amara Osei', email: 'amara.osei@example.com', amount: 450, currency: 'USD', method: 'Card', status: 'paid', description: 'Premium wedding package', invoiceNumber: 'INV-2026-001', dueDate: '2026-06-01', createdAt: '2026-06-01T10:00:00' },
  { id: 'pay_002', user: 'Malik Johnson', email: 'malik.johnson@example.com', amount: 280, currency: 'USD', method: 'PayPal', status: 'pending', description: 'Corporate event gallery', invoiceNumber: 'INV-2026-002', dueDate: '2026-06-20', createdAt: '2026-06-10T12:15:00' },
  { id: 'pay_003', user: 'Nia Darko', email: 'nia.darko@example.com', amount: 120, currency: 'USD', method: 'Bank transfer', status: 'failed', description: 'Birthday mini session', invoiceNumber: 'INV-2026-003', dueDate: '2026-06-12', createdAt: '2026-06-12T09:45:00' },
  { id: 'pay_004', user: 'Daniel Mensah', email: 'daniel.mensah@example.com', amount: 90, currency: 'USD', method: 'Card', status: 'paid', description: 'Storage upgrade', invoiceNumber: 'INV-2026-004', dueDate: '2026-06-05', createdAt: '2026-06-05T18:20:00' }
];

export const mockCoupons = [
  { id: 'cpn_001', code: 'WEDDING20', type: 'percentage', value: 20, currency: 'USD', validFrom: '2026-06-01', validUntil: '2026-07-31', maxUses: 100, used: 32, minOrder: 200, plans: ['Premium', 'Business'], description: 'Wedding package discount', active: true, firstTimeOnly: false, userGroups: ['Client'], referralOnly: false },
  { id: 'cpn_002', code: 'NEWCLIENT15', type: 'percentage', value: 15, currency: 'USD', validFrom: '2026-05-15', validUntil: '2026-08-15', maxUses: 50, used: 11, minOrder: 100, plans: ['Premium', 'Professional'], description: 'First-time client offer', active: true, firstTimeOnly: true, userGroups: ['Client'], referralOnly: false },
  { id: 'cpn_003', code: 'STORAGE10', type: 'fixed', value: 10, currency: 'USD', validFrom: '2026-06-10', validUntil: '2026-06-30', maxUses: 25, used: 7, minOrder: 50, plans: ['Business'], description: 'Storage upgrade rebate', active: false, firstTimeOnly: false, userGroups: ['Photographer'], referralOnly: false }
];

export const mockPlans = [
  { id: 'plan_001', name: 'Free', price: 0, cycle: 'monthly', features: ['5 GB storage', 'Public galleries', 'Basic support'], active: true, popular: false, order: 1 },
  { id: 'plan_002', name: 'Premium', price: 29, cycle: 'monthly', features: ['50 GB storage', 'Private galleries', 'Priority support'], active: true, popular: true, order: 2 },
  { id: 'plan_003', name: 'Business', price: 79, cycle: 'monthly', features: ['250 GB storage', 'Client proofing', 'Revenue tools'], active: true, popular: false, order: 3 }
];

export const mockSystemAlerts = [
  { id: 'sys_alert_001', title: 'Storage threshold warning', message: 'Multiple users are above 80% storage usage.', type: 'warning', priority: 'high', target: 'admins', schedule: 'immediate', active: true, createdAt: '2026-06-16T10:00:00' },
  { id: 'sys_alert_002', title: 'Weekly analytics digest', message: 'Your weekly performance report is ready.', type: 'info', priority: 'medium', target: 'admins', schedule: 'recurring', active: true, createdAt: '2026-06-15T08:00:00' }
];

export const mockAlertTemplates = [
  { id: 'tmpl_001', name: 'Storage Warning', subject: 'Storage usage is high', message: 'Your storage usage has reached {{threshold}}%.' },
  { id: 'tmpl_002', name: 'Payment Reminder', subject: 'Invoice reminder', message: 'Invoice {{invoiceNumber}} is due on {{dueDate}}.' }
];

export const mockAlertHistory = [
  { id: 'hist_001', title: 'Storage threshold warning', target: 'admins', sentAt: '2026-06-16T10:05:00', status: 'sent' },
  { id: 'hist_002', title: 'Weekly analytics digest', target: 'admins', sentAt: '2026-06-15T08:00:00', status: 'sent' }
];

export const mockSystemTriggers = [
  { id: 'trig_storage', label: 'Storage exceeded', enabled: true },
  { id: 'trig_security', label: 'Security breach detected', enabled: true },
  { id: 'trig_payment', label: 'Payment failed', enabled: true },
  { id: 'trig_maintenance', label: 'Maintenance window started', enabled: false }
];

export const mockPerformance = {
  apiResponse: [42, 38, 56, 44, 62, 48, 41],
  serverLoad: 64,
  dbLatency: 28,
  cacheHitRate: 91,
  errorRate: 0.7,
  requestsPerMinute: 1280
};

export const mockErrorLogs = [
  { id: 'err_001', message: 'Payment gateway timeout', severity: 'error', source: 'payments-api', timestamp: '2026-06-17T01:10:00', count: 4, resolved: false, stack: 'TimeoutError: ETIMEDOUT\n    at PaymentClient.request' },
  { id: 'err_002', message: 'Image resize worker failed', severity: 'warning', source: 'media-worker', timestamp: '2026-06-16T23:20:00', count: 2, resolved: false, stack: 'ResizeError: Invalid dimensions\n    at ImageWorker.process' },
  { id: 'err_003', message: 'Expired session token', severity: 'info', source: 'auth-service', timestamp: '2026-06-16T18:45:00', count: 9, resolved: true, stack: 'TokenExpiredError: jwt expired\n    at AuthMiddleware.verify' }
];

export const mockApiKeys = [
  { id: 'api_001', name: 'Studio mobile app', key: 'sk_live_••••••••9F2A', rateLimit: 1200, active: true, createdAt: '2026-01-10' },
  { id: 'api_002', name: 'Analytics importer', key: 'sk_test_••••••••1C7B', rateLimit: 300, active: false, createdAt: '2026-03-22' }
];

export const mockSettings = { siteName: 'kofiLartey Studio', description: 'Professional photography and client gallery platform.', contactEmail: 'hello@kofinartey.com', contactPhone: '+233 55 765 5008', logoUrl: '', primaryColor: '#2563eb', timezone: 'Africa/Accra', language: 'en', metaTitle: 'kofiLartey Studio', metaDescription: 'Book photographers and manage galleries with kofiLartey Studio.' };
export const mockSecuritySettings = { minLength: 10, requireSpecialChars: true, expiryDays: 90, twoFactor: true, sessionTimeout: 30, ipWhitelist: '127.0.0.1, 192.168.1.0/24', loginAttemptLimit: 5 };
export const mockStorageSettings = { provider: 'S3', bucketPath: 'kofinartey-studios/media', maxFileSize: 50, allowedExtensions: 'jpg, jpeg, png, webp, heic', cdnUrl: 'https://cdn.example.com', backupEnabled: true };
export const mockEmailSettings = { smtpHost: 'smtp.example.com', smtpPort: 587, smtpUser: 'notifications@example.com', smtpPassword: '••••••••', fromName: 'kofiLartey Studio', fromAddress: 'notifications@kofinartey.com', templates: [{ id: 'tpl_email_001', name: 'Welcome', subject: 'Welcome to kofiLartey Studio' }], notificationToggles: { newGallery: true, paymentReceipt: true, supportTicket: true } };
export const mockIntegrations = { social: { google: { enabled: true, clientId: 'google-client-id', clientSecret: '••••••••' }, facebook: { enabled: false, clientId: '', clientSecret: '' }, github: { enabled: false, clientId: '', clientSecret: '' } }, payments: { stripe: { enabled: true, publishableKey: 'pk_live_••••', secretKey: 'sk_live_••••' }, paypal: { enabled: false, clientId: '', secret: '' } }, analytics: { ga4TrackingId: 'G-XXXXXXXXXX', enabled: true }, cdn: { enabled: true, provider: 'CloudFront' } };
export const mockBackups = [{ id: 'bk_001', name: 'Daily database backup', type: 'Database', createdAt: '2026-06-17T00:00:00', size: 1.8, status: 'verified' }, { id: 'bk_002', name: 'Weekly media manifest', type: 'Media manifest', createdAt: '2026-06-15T03:00:00', size: 0.4, status: 'pending' }];
export const mockAnnouncements = [{ id: 'ann_001', title: 'New gallery tools are live', message: 'Clients can now comment directly on gallery proofs.', target: 'clients', schedule: '2026-06-20T09:00:00', views: 320, clicks: 48, active: true }];
export const mockMessages = [{ id: 'msg_001', target: 'Amara Osei', subject: 'Your gallery is ready', sentAt: '2026-06-16T12:00:00', status: 'sent' }, { id: 'msg_002', target: 'Malik Johnson', subject: 'Invoice reminder', sentAt: '2026-06-15T16:30:00', status: 'draft' }];
export const mockTickets = [{ id: 'ticket_001', title: 'Cannot download gallery', status: 'open', priority: 'high', assignee: 'Esi Amoah', createdAt: '2026-06-16T14:00:00' }, { id: 'ticket_002', title: 'Payment receipt missing', status: 'resolved', priority: 'medium', assignee: 'Admin', createdAt: '2026-06-14T11:20:00' }];
export const mockFaqs = [{ id: 'faq_001', question: 'How do clients download images?', answer: 'Open the gallery and use the Download Gallery button.' }, { id: 'faq_002', question: 'Can I change my storage plan?', answer: 'Yes, update your plan from the billing settings page.' }];
export const mockAppConfig = { version: '2.4.0', changelog: 'Improved gallery search and push notification delivery.', pushEnabled: true, deepLinks: 'kofinartey://gallery/{id}', minVersion: '2.1.0' };
export const mockLanguages = [{ id: 'lang_en', name: 'English', code: 'en', flag: '🇬🇭', direction: 'LTR', default: true }, { id: 'lang_fr', name: 'French', code: 'fr', flag: '🇫🇷', direction: 'LTR', default: false }, { id: 'lang_ar', name: 'Arabic', code: 'ar', flag: '🇸🇦', direction: 'RTL', default: false }];
export const mockTranslations = [{ key: 'home.hero.title', en: 'Capture your story', fr: 'Capturez votre histoire', ar: 'التقط قصتك' }, { key: 'gallery.download', en: 'Download gallery', fr: 'Télécharger la galerie', ar: 'تنزيل المعرض' }];
export const mockReports = [{ id: 'rep_custom_001', title: 'Monthly revenue report', metrics: ['Revenue', 'New users'], grouping: 'month', schedule: 'monthly', active: true }];
export const mockMigrationStatus = [{ id: 'mig_001', name: 'Client import preview', type: 'CSV', status: 'completed', createdAt: '2026-06-10T09:00:00' }, { id: 'mig_002', name: 'Legacy gallery export', type: 'JSON', status: 'queued', createdAt: '2026-06-12T11:00:00' }];
export const mockMaintenance = { enabled: false, scheduled: false, startAt: '2026-07-01T00:00:00', endAt: '2026-07-01T02:00:00', message: 'We are improving gallery performance.', whitelistIps: '127.0.0.1, 203.0.113.10' };
export const mockRevenue = { mrr: 1280, arr: 15360, churnRate: 2.4, ltv: 840, revenueSeries: [920, 1040, 1180, 1210, 1265, 1280], methodBreakdown: [{ name: 'Card', value: 62 }, { name: 'PayPal', value: 24 }, { name: 'Bank transfer', value: 14 }] };
export const mockStorageHistory = [42, 48, 55, 61, 69, 74, 78];
export const mockUsageStats = [{ label: 'Users', value: 84 }, { label: 'Engagement', value: 67 }, { label: 'Revenue', value: 73 }, { label: 'Content', value: 58 }];
export const mockEngagementStats = [34, 41, 38, 52, 57, 63, 68];
export const mockGrowthStats = [12, 18, 16, 24, 29, 35, 41];

export const initialAdminData = {
  users: mockUsers,
  roles: mockRoles,
  activityLogs: mockActivityLogs,
  alerts: mockAlerts,
  images: mockImages,
  featuredImages: mockFeaturedImages,
  blogPosts: mockBlogPosts,
  categories: mockCategories,
  tags: mockTags,
  pendingApprovals: mockPendingApprovals,
  reportedContent: mockReportedContent,
  payments: mockPayments,
  coupons: mockCoupons,
  plans: mockPlans,
  systemAlerts: mockSystemAlerts,
  alertTemplates: mockAlertTemplates,
  alertHistory: mockAlertHistory,
  systemTriggers: mockSystemTriggers,
  performance: mockPerformance,
  errorLogs: mockErrorLogs,
  apiKeys: mockApiKeys,
  settings: mockSettings,
  securitySettings: mockSecuritySettings,
  storageSettings: mockStorageSettings,
  emailSettings: mockEmailSettings,
  integrations: mockIntegrations,
  backups: mockBackups,
  announcements: mockAnnouncements,
  messages: mockMessages,
  tickets: mockTickets,
  faqs: mockFaqs,
  appConfig: mockAppConfig,
  languages: mockLanguages,
  translations: mockTranslations,
  reports: mockReports,
  migrationStatus: mockMigrationStatus,
  maintenance: mockMaintenance
};
