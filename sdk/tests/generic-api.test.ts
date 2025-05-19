import { StatusCodes } from 'http-status-codes';

import { Api } from '../index';

describe('generic api routes', () => {
  const genericApi = new Api({
    baseURL: 'http://localhost:10102'
  });

  it.concurrent('should GET the api info /api', async () => {
    const response = await genericApi.appControllerGetApiDetails();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toMatchSnapshot();
  });

  it.concurrent('should GET the api prometheus metrics /api/metrics', async () => {
    const response = await genericApi.prometheusControllerIndex();

    expect(response.status).toBe(StatusCodes.OK);
    // since this response changes frequently, we will not snapshot it
    expect(response.data).toContain('process_cpu_user_seconds_total');
    expect(response.data).toContain('{app="achievibit');
  });

  it.concurrent('should GET the dev center options /api/swagger', async () => {
    const response = await genericApi.appControllerGetDevCenterOptions();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toMatchSnapshot();
  });

  it.concurrent('should GET audio pronunciation /api/pronunciation', async () => {
    const response = await genericApi.appControllerGetWordPronunciation();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.headers['content-type']).toBe('audio/mpeg');
    expect(response.data).toBeDefined();
    expect(response.data.toString().length).toBeGreaterThan(0);
  });

  it.concurrent('should GET the timezones /api/timezones', async () => {
    const response = await genericApi.appControllerGetTimezones();

    expect(response.status).toBe(200);
    // don't use snapshot because of size
    expect(response.data).toBeDefined();
    // check that the response is a map
    expect(typeof response.data).toBe('object');
    // check that the response has at least one key
    expect(Object.keys(response.data).length).toBeGreaterThan(0);
    // check that the response has at least one value
    expect(Object.values(response.data).length).toBeGreaterThan(0);
  });

  it.concurrent('should GET the socket.io script /socket.io', async () => {
    const response = await genericApi.instance.get('/socket.io');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toContain('* Socket.IO v');
    expect(response.data).toContain('* Released under the MIT License.');
  });
});
