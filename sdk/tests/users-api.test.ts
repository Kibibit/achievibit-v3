import { Users } from '../index';
import { StatusCodes } from 'http-status-codes';

describe('users api routes', () => {
  const usersApi = new Users({
    baseURL: 'http://localhost:10102',
  });
  
  it.concurrent('should GET all users with pagination /api/users', async () => {
    const response = await usersApi.usersControllerGetUsers();

    expect(response.status).toBe(StatusCodes.OK);
    // return data is paginated
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta).toMatchSnapshot();
    expect(response.data.data).toBeDefined();
    // check that the response is an array
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it.concurrent('should GET a single user by id /api/users/{id}', async () => {
    const response = await usersApi.usersControllerGetUser('1');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toBeDefined();
  });
});
