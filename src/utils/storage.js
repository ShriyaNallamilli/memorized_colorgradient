const HIGH_SCORE_KEY = 'color-memory-high-score';
const LEADERBOARD_KEY = 'color-memory-leaderboard';

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function loadHighScore() {
  const storage = getStorage();

  if (!storage) {
    return 0;
  }

  return Number(storage.getItem(HIGH_SCORE_KEY) || 0);
}

export function saveHighScore(score) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const currentHighScore = loadHighScore();
  storage.setItem(HIGH_SCORE_KEY, String(Math.max(currentHighScore, score)));
}

export function loadLeaderboard() {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const parsed = JSON.parse(storage.getItem(LEADERBOARD_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(entry) {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  const nextLeaderboard = [entry, ...loadLeaderboard()]
    .sort((firstEntry, secondEntry) => secondEntry.score - firstEntry.score)
    .slice(0, 5);

  storage.setItem(LEADERBOARD_KEY, JSON.stringify(nextLeaderboard));
  return nextLeaderboard;
}

export function clearLeaderboard() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(LEADERBOARD_KEY);
}

export function clearHighScore() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(HIGH_SCORE_KEY);
}