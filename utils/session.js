const sessions = new Map();

export const createSession = (telegramId, username) => {
  sessions.set(telegramId, {
    username,
    lastActive: Date.now(),
  });
};

export const getSession = (telegramId) => sessions.get(telegramId);

export const isSessionExpired = (telegramId, maxAgeMinutes = 30) => {
  const session = sessions.get(telegramId);
  if (!session) return true;
  return Date.now() - session.lastActive > maxAgeMinutes * 60 * 1000;
};

export const refreshSession = (telegramId) => {
  const session = sessions.get(telegramId);
  if (session) session.lastActive = Date.now();
};