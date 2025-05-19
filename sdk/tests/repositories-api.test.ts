import { StatusCodes } from 'http-status-codes';
import { Repositories } from '../index';

describe('repositories api routes', () => {
  const reposApi = new Repositories({
    baseURL: 'http://localhost:10102',
  });
  
  it.concurrent('should GET all repositories with pagination /api/repos', async () => {
    const response = await reposApi.repositoriesControllerGetRepos();

    expect(response.status).toBe(StatusCodes.OK);
    // return data is paginated
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta).toMatchSnapshot();
    expect(response.data.data).toBeDefined();
    // check that the response is an array
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it.concurrent('should GET a repository by its fullname /api/repos/{owner}/{name}', async () => {
    const response = await reposApi.repositoriesControllerGetRepo('octocat', 'Hello-World');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toBeDefined();
    expect(response.data).toMatchSnapshot();
  });

  it.skip('should GET a generated repo avatar using openAI /api/repos/test-openai', async () => {
    const response = await reposApi.repositoriesControllerTestOpenAi();

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toBeDefined();
    // check that the response is a base64 string
    expect(response.data.startsWith('data:image/png;base64,')).toBe(true);

    // increase timeout for this test
  }, 30000);
});
