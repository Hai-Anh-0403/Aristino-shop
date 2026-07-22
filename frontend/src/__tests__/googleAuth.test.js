describe('Google OAuth Token Parsing & Customer Session Handling', () => {
  const CLIENT_ID = '441420514783-43fqftm28s7fp57qvpm1n30nbhbfiq2p.apps.googleusercontent.com';

  const parseGoogleCredential = (credential) => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const createGoogleUserSession = (decodedPayload, rawToken) => {
    if (!decodedPayload || !decodedPayload.email) return null;
    return {
      email: decodedPayload.email,
      firstName: decodedPayload.given_name || decodedPayload.name?.split(' ')[0] || 'Google',
      lastName: decodedPayload.family_name || decodedPayload.name?.split(' ').slice(1).join(' ') || 'User',
      provider: 'google',
      avatarUrl: decodedPayload.picture || '',
      googleId: decodedPayload.sub,
      idToken: rawToken,
    };
  };

  // Helper to build mock base64url encoded JWT
  const buildMockJwt = (payloadObj) => {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(payloadObj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const signature = 'mock_signature';
    return `${header}.${payload}.${signature}`;
  };

  test('correctly decodes valid Google JWT ID token payload', () => {
    const mockPayload = {
      iss: 'https://accounts.google.com',
      aud: CLIENT_ID,
      sub: 'google-uid-100200300',
      email: 'customer.test@gmail.com',
      email_verified: true,
      name: 'Nguyen Van A',
      given_name: 'Nguyen',
      family_name: 'Van A',
      picture: 'https://lh3.googleusercontent.com/a/mock-photo',
    };

    const token = buildMockJwt(mockPayload);
    const parsed = parseGoogleCredential(token);

    expect(parsed).not.toBeNull();
    expect(parsed.email).toBe('customer.test@gmail.com');
    expect(parsed.sub).toBe('google-uid-100200300');
    expect(parsed.aud).toBe(CLIENT_ID);
  });

  test('constructs customer session object from parsed Google JWT payload', () => {
    const mockPayload = {
      sub: '1092837465',
      email: 'aristino.buyer@gmail.com',
      name: 'Minh Tu',
      given_name: 'Minh',
      family_name: 'Tu',
      picture: 'https://lh3.googleusercontent.com/a/photo',
    };

    const token = buildMockJwt(mockPayload);
    const parsed = parseGoogleCredential(token);
    const session = createGoogleUserSession(parsed, token);

    expect(session).toEqual({
      email: 'aristino.buyer@gmail.com',
      firstName: 'Minh',
      lastName: 'Tu',
      provider: 'google',
      avatarUrl: 'https://lh3.googleusercontent.com/a/photo',
      googleId: '1092837465',
      idToken: token,
    });
  });

  test('returns null gracefully on malformed token strings', () => {
    expect(parseGoogleCredential('invalid.token')).toBeNull();
    expect(parseGoogleCredential('')).toBeNull();
  });
});
