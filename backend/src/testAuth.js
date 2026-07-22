require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const UserSession = require('./models/UserSession');
const authController = require('./controllers/authController');

// Mock Express req/res objects for testing controller methods directly
function createMockReqRes({ body = {}, params = {}, query = {}, headers = {}, cookies = {}, user = null, session = null }) {
  const req = {
    body,
    params,
    query,
    headers,
    cookies,
    ip: '127.0.0.1',
    user,
    session,
  };

  const res = {
    statusCode: 200,
    headers: {},
    cookiesSet: {},
    cookiesCleared: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.responseData = data;
      return this;
    },
    cookie(name, val, opts) {
      this.cookiesSet[name] = { val, opts };
      return this;
    },
    clearCookie(name, opts) {
      this.cookiesCleared[name] = opts;
      return this;
    },
  };

  return { req, res };
}

async function runTests() {
  console.log('🧪 Starting Auth & Session Management Unit & Controller Tests...\n');

  try {
    // Connect to in-memory or local test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-web-test';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);

    // Clean up test collections
    await User.deleteMany({ email: { $in: ['admin@test.com', 'super@test.com'] } });
    await UserSession.deleteMany({});

    // 1. Create Test Admin & SuperAdmin Users
    console.log('\n--- Test 1: User Model & Password Hashing ---');
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'SecurePassword123!',
      name: 'Admin User',
      role: 'admin',
    });
    console.log('✅ Admin user created. ID:', adminUser._id);
    
    // Verify password hashing
    const passMatches = await adminUser.comparePassword('SecurePassword123!');
    console.log('✅ Password bcrypt validation:', passMatches ? 'PASS' : 'FAIL');
    if (!passMatches) throw new Error('Password compare failed');

    const superAdminUser = await User.create({
      email: 'super@test.com',
      password: 'SuperPassword123!',
      name: 'Super Admin User',
      role: 'superadmin',
    });
    console.log('✅ SuperAdmin user created. ID:', superAdminUser._id);

    // 2. Test Login Controller
    console.log('\n--- Test 2: Login Flow ---');
    const { req: loginReq, res: loginRes } = createMockReqRes({
      body: { email: 'admin@test.com', password: 'SecurePassword123!' },
      headers: { 'user-agent': 'Jest-Test-Agent/1.0' },
    });

    await authController.login(loginReq, loginRes);
    console.log('Login Response Status:', loginRes.statusCode);
    console.log('Login Response Body:', loginRes.responseData);
    console.log('Login Cookie Set:', loginRes.cookiesSet.refreshToken ? 'HttpOnly Cookie Set' : 'Missing');

    if (loginRes.statusCode !== 200 || !loginRes.responseData.accessToken) {
      throw new Error('Login failed');
    }

    const accessToken = loginRes.responseData.accessToken;
    const refreshToken = loginRes.cookiesSet.refreshToken.val;

    // Verify session recorded in MongoDB
    const activeSessions = await UserSession.find({ user_id: adminUser._id });
    console.log('✅ Active sessions in DB:', activeSessions.length);
    console.log('   Session ID:', activeSessions[0].session_id);
    console.log('   Is Valid:', activeSessions[0].is_valid);
    console.log('   User Agent:', activeSessions[0].user_agent);

    const sessionId = activeSessions[0].session_id;

    // 3. Test Refresh Token Controller
    console.log('\n--- Test 3: Refresh Token Flow ---');
    const { req: refreshReq, res: refreshRes } = createMockReqRes({
      cookies: { refreshToken },
    });

    await authController.refreshToken(refreshReq, refreshRes);
    console.log('Refresh Response Status:', refreshRes.statusCode);
    console.log('New Access Token Issued:', !!refreshRes.responseData.accessToken);

    if (refreshRes.statusCode !== 200 || !refreshRes.responseData.accessToken) {
      throw new Error('Refresh Token failed');
    }

    // 4. Test List Sessions Controller
    console.log('\n--- Test 4: List Sessions ---');
    const { req: listReq, res: listRes } = createMockReqRes({
      user: adminUser,
      session: activeSessions[0],
    });

    await authController.listSessions(listReq, listRes);
    console.log('List Sessions Status:', listRes.statusCode);
    console.log('Total Sessions Found:', listRes.responseData.count);
    console.log('First Session Is Current:', listRes.responseData.sessions[0].is_current);

    // 5. Test Revoke Session (Force Logout) Controller
    console.log('\n--- Test 5: Revoke Session (Force Logout) ---');
    const { req: revokeReq, res: revokeRes } = createMockReqRes({
      params: { sessionId },
      user: superAdminUser, // SuperAdmin revoking admin's session
    });

    await authController.revokeSession(revokeReq, revokeRes);
    console.log('Revoke Status:', revokeRes.statusCode);
    console.log('Revoke Response Message:', revokeRes.responseData.message);

    // Verify in DB that is_valid is now false
    const updatedSession = await UserSession.findOne({ session_id: sessionId });
    console.log('✅ DB Session is_valid after revocation:', updatedSession.is_valid);
    if (updatedSession.is_valid !== false) {
      throw new Error('Revocation failed to set is_valid to false');
    }

    // 6. Test Refresh Token Attempt on Revoked Session (Should Fail)
    console.log('\n--- Test 6: Refresh Attempt on Revoked Session ---');
    const { req: failedRefreshReq, res: failedRefreshRes } = createMockReqRes({
      cookies: { refreshToken },
    });

    await authController.refreshToken(failedRefreshReq, failedRefreshRes);
    console.log('Failed Refresh Status:', failedRefreshRes.statusCode);
    console.log('Failed Refresh Message:', failedRefreshRes.responseData.message);
    console.log('Cookie Cleared:', !!failedRefreshRes.cookiesCleared.refreshToken);

    if (failedRefreshRes.statusCode !== 401 || failedRefreshRes.responseData.code !== 'SESSION_REVOKED') {
      throw new Error('Failed refresh on revoked session did not return SESSION_REVOKED');
    }

    // 7. Cleanup
    await User.deleteMany({ email: { $in: ['admin@test.com', 'super@test.com'] } });
    await UserSession.deleteMany({});
    await mongoose.disconnect();

    console.log('\n🎉 ALL AUTH & SESSION MANAGEMENT TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests();
