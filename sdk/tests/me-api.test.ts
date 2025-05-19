import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import nock from 'nock';

import { Authentication, SessionUser } from '../index';

describe('session user api routes', () => {
  const sessionUserApi = new SessionUser({
    baseURL: 'http://localhost:10102'
  });
  const authApi = new Authentication({
    baseURL: 'http://localhost:10102'
  });

  // beforeAll(() => {
  //   nock.disableNetConnect(); // blocks real HTTP requests
  // });

  beforeEach(() => {
    nock.cleanAll();

    // Step 1: simulate GitHub redirect from authorize
    // nock('https://github.com')
    //   .get('/login/oauth/authorize')
    //   .query(true)
    //   .reply(302, undefined, {
    //     Location: 'http://localhost:10102/api/auth/github/callback?code=mock-code&state=mock-state'
    //   });

    // // Step 2: simulate token exchange
    // nock('https://github.com')
    //   .post('/login/oauth/access_token', (body) => {
    //     console.log('🟡 GitHub token exchange body received by nock:', body);
    //     return true; // accept any body
    //   })
    //   .reply(200, {
    //     access_token: 'mock-access-token',
    //     token_type: 'bearer'
    //   });

    // // Step 3: simulate fetching GitHub user
    // nock('https://api.github.com')
    //   .get('/user')
    //   .matchHeader('authorization', 'Bearer mock-access-token')
    //   .reply(200, {
    //     login: 'mockuser',
    //     id: 12345,
    //     email: 'mock@user.com'
    //   });
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.warn('Unused nock mocks:', nock.pendingMocks());
    }
    nock.cleanAll();
  });

  it.skip('should GET a user logged out /api/auth/logout', async () => {
    try {
      // nock.recorder.rec({
      //   output_objects: true,
      //   dont_print: false
      // });
      // Simulate redirect to callback with a valid code
      // const callbackResponse = await authApi.githubControllerGithubAuthCallback({
      //   code: 'mock-code',
      //   state: 'mock-state'
      // });

      // expect(callbackResponse.status).toBe(5);

      // console.log('loginResponse', loginResponse.data);
      // generate a JWT token
      const jwtSecret = 'development-mode';
      const achievibitJwtToken = jwt.sign(
        {
          id: 1,
          email: 'mock.user@blah.io',
          username: 'mockuser',
          exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiration
        },
        jwtSecret,
        {
          algorithm: 'HS256'
        }
      );
      const response = await sessionUserApi.sessionUserControllerLogout({
        headers: {
          Authorization: `Bearer ${ achievibitJwtToken }`
        }
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.data).toMatchSnapshot();
    } catch (error) {
      const axiosError = (error || {}) as any;
      console.error('error', axiosError.toString());
    }

    // nock.recorder.clear();
    // nock.recorder.play();
  });

  it('should FAIL to GET a user logged out if not authenticated /api/auth/logout', async () => {
    try {
      await sessionUserApi.sessionUserControllerLogout();
    } catch (error) {
      const axiosError = (error || {}) as any;

      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
    }
  });
});
