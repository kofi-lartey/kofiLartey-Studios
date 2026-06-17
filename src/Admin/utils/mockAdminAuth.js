export const MOCK_ADMIN_CREDENTIALS = {
  email: 'kofilartey12@gmail.com',
  password: '1234567890'
};

export const MOCK_ADMIN_SESSION_KEY = 'mockAdminSession';

export const mockAdminProfile = {
  name: 'Kofi Lartey',
  email: MOCK_ADMIN_CREDENTIALS.email,
  role: 'Super Admin'
};

export const getMockAdminSession = () => {
  try {
    return JSON.parse(localStorage.getItem(MOCK_ADMIN_SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

export const isMockAdminAuthenticated = () => Boolean(getMockAdminSession());

export const loginMockAdmin = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (
    normalizedEmail !== MOCK_ADMIN_CREDENTIALS.email ||
    normalizedPassword !== MOCK_ADMIN_CREDENTIALS.password
  ) {
    throw new Error('Invalid admin credentials.');
  }

  const session = {
    ...mockAdminProfile,
    authenticatedAt: new Date().toISOString()
  };

  localStorage.setItem(MOCK_ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const logoutMockAdmin = () => {
  localStorage.removeItem(MOCK_ADMIN_SESSION_KEY);
};
