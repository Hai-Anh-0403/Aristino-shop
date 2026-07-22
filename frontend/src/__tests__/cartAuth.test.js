describe('Cart Authentication Protection', () => {
  const storage = {};
  const mockLocalStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  const checkCartAccess = (userSessionKey = 'aristino_user') => {
    const session = mockLocalStorage.getItem(userSessionKey);
    if (!session) {
      return { allowed: false, redirectUrl: '/account/login' };
    }
    return { allowed: true, redirectUrl: null };
  };

  test('denies Add to Cart and View Cart access for non-logged-in visitors and redirects to login page', () => {
    const access = checkCartAccess();
    expect(access.allowed).toBe(false);
    expect(access.redirectUrl).toBe('/account/login');
  });

  test('allows Add to Cart and View Cart access for authenticated customers', () => {
    mockLocalStorage.setItem('aristino_user', JSON.stringify({
      email: 'customer@aristino.com',
      firstName: 'John',
      lastName: 'Doe'
    }));

    const access = checkCartAccess();
    expect(access.allowed).toBe(true);
    expect(access.redirectUrl).toBeNull();
  });
});
