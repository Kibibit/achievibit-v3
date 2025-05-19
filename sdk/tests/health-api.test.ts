import { StatusCodes } from 'http-status-codes';

import { Health } from '../index';

describe('health api routes', () => {
  const healthApi = new Health({
    baseURL: 'http://localhost:10102'
  });

  it.concurrent('should GET application health /api/health', async () => {
    const response = await healthApi.healthControllerCheck();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toMatchSnapshot();
  });

  it.concurrent('should GET devtools health /api/devtools', async () => {
    const response = await healthApi.healthControllerCheckDevTools();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toMatchSnapshot();
  });

  it.skip('should GET external health /api/external', async () => {
    const response = await healthApi.healthControllerCheckExternalApi();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toMatchSnapshot();
  });
});
