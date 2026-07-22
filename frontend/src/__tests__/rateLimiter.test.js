describe('Contact Submission Rate Limiter', () => {
  const WINDOW_MS = 15 * 60 * 1000;
  const MAX_ATTEMPTS = 3;

  // Mock localStorage for node environment if missing
  const storage = {};
  const mockLocalStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  const getRecentSubmissions = (userKey) => {
    try {
      const raw = mockLocalStorage.getItem(`contact_rate_limit_${userKey}`);
      if (!raw) return [];
      const list = JSON.parse(raw);
      const now = Date.now();
      return list.filter((t) => now - t < WINDOW_MS);
    } catch {
      return [];
    }
  };

  const recordSubmission = (userKey) => {
    const recent = getRecentSubmissions(userKey);
    recent.push(Date.now());
    mockLocalStorage.setItem(`contact_rate_limit_${userKey}`, JSON.stringify(recent));
  };

  test('allows up to 3 contact submission attempts within 15 minutes for user A', () => {
    const userA = 'user_alex@gmail.com';

    expect(getRecentSubmissions(userA).length).toBe(0);

    recordSubmission(userA);
    recordSubmission(userA);
    recordSubmission(userA);

    expect(getRecentSubmissions(userA).length).toBe(MAX_ATTEMPTS);
    expect(getRecentSubmissions(userA).length >= MAX_ATTEMPTS).toBe(true);
  });

  test('rate limit for user A does not impact user B', () => {
    const userA = 'user_alex@gmail.com';
    const userB = 'user_jordan@gmail.com';

    recordSubmission(userA);
    recordSubmission(userA);
    recordSubmission(userA);

    expect(getRecentSubmissions(userA).length).toBe(3);
    // User B should still have 0 attempts
    expect(getRecentSubmissions(userB).length).toBe(0);

    // User B can submit successfully
    recordSubmission(userB);
    expect(getRecentSubmissions(userB).length).toBe(1);
  });
});
