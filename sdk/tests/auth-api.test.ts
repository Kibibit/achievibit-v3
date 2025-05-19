import { StatusCodes } from 'http-status-codes';
import { Authentication } from '../index';

describe('authentication api routes', () => {
  const authApi = new Authentication({
    baseURL: 'http://localhost:10102',
  });
  
  it.skip('should GET a user logged out /api/auth/logout', async () => {
    try {
      const response = await authApi.authControllerLogout();

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.data).toMatchSnapshot();
    } catch (error) {
      const axiosError = (error || {}) as any;
      console.error('error', axiosError.toString());
    }
  });

  it('should FAIL to GET a user logged out if not authenticated /api/auth/logout', async () => {
    try {
      await authApi.authControllerLogout();
    } catch (error) {
      const axiosError = (error || {}) as any;
      
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
    }
  });
});
