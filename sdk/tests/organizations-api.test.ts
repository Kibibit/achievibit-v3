import { StatusCodes } from 'http-status-codes';
import { Organizations } from '../index';

describe('organizations api routes', () => {
  const organizationsApi = new Organizations({
    baseURL: 'http://localhost:10102',
  });
  
  it.concurrent('should GET all organizations with pagination /api/organizations', async () => {
    const response = await organizationsApi.organizationsControllerGetOrganizations();

    expect(response.status).toBe(StatusCodes.OK);
    // return data is paginated
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta).toMatchSnapshot();
    expect(response.data.data).toBeDefined();
    // check that the response is an array
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it.concurrent('should GET a single organization by id /api/organizations/{id}', async () => {
    const response = await organizationsApi.organizationsControllerGetOrganization('1');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toBeDefined();
  });
});
