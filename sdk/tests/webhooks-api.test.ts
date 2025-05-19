import { createHmac } from 'crypto';
import { Webhooks } from '../index';
import { StatusCodes } from 'http-status-codes';
import { AxiosError } from 'axios';

describe('webhooks api routes', () => {
  const webhooksApi = new Webhooks({
    baseURL: 'http://localhost:10102',
  });
  
  it('should POST a GitHub webhook /api/webhooks/github', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };

    const secret = 'development-mode';
    const hmac = createHmac('sha256', secret);
    const digest = 'sha256=' + hmac
      .update(JSON.stringify(webhookBody))
      .digest('hex');

    try {
      const response = await webhooksApi.webhooksControllerGithub({
        test: 'test',
        action: 'test',
      }, {
        headers: {
          'x-hub-signature-256': digest
        }
      });
      
      expect(response.status).toBe(StatusCodes.CREATED);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      console.error('error', axiosError.toString());
    }
  });

  it('should FAIL to POST a GitHub webhook with wrong signature /api/webhooks/github', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };
    const digest = 'sha256=wrongsignature';

    try {
      await webhooksApi.webhooksControllerGithub(
        webhookBody,
        {
          headers: {
            'x-hub-signature-256': digest
          }
        }
      );
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('Invalid signature'); 
    }
  });

  it('should FAIL to POST a GitHub webhook with missing signature /api/webhooks/github', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };

    try {
      await webhooksApi.webhooksControllerGithub(webhookBody);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('No signature provided'); 
    }
  });

  it('should POST a GitLab webhook /api/webhooks/gitlab', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };
    const secret = 'development-mode';

    try {
      const response = await webhooksApi.webhooksControllerGitlab(
        webhookBody,
        {
          headers: {
            'x-gitlab-token': secret
          }
        }
      );
      expect(response.status).toBe(StatusCodes.CREATED);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      console.error('error', axiosError.toString());
    }
  });

  it('should FAIL to POST a GitLab webhook with wrong secret /api/webhooks/gitlab', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };
    const secret = 'wrongsecret';

    try {
      await webhooksApi.webhooksControllerGitlab(
        webhookBody,
        {
          headers: {
            'x-gitlab-token': secret
          }
        }
      );
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('Invalid token'); 
    }
  });

  it('should FAIL to POST a GitLab webhook with missing secret /api/webhooks/gitlab', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };

    try {
      await webhooksApi.webhooksControllerGitlab(webhookBody);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('No token provided'); 
    }
  });

  it('should POST a Bitbucket webhook /api/webhooks/bitbucket', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };
    const secret = 'development-mode';
    const hmac = createHmac('sha256', secret);
    const digest = hmac
      .update(JSON.stringify(webhookBody))
      .digest('hex');

    try {
      const response = await webhooksApi.webhooksControllerBitbucket(
        webhookBody,
        {
          headers: {
            'x-hub-signature': digest
          }
        }
      );
      expect(response.status).toBe(StatusCodes.CREATED);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      console.error('error', axiosError.toString());
    }
  });

  it('should FAIL to POST a Bitbucket webhook with wrong signature /api/webhooks/bitbucket', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };
    const digest = 'wrongsignature';

    try {
      await webhooksApi.webhooksControllerBitbucket(
        webhookBody,
        {
          headers: {
            'x-hub-signature': digest
          }
        }
      );
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('Invalid signature'); 
    }
  });

  it('should FAIL to POST a Bitbucket webhook with missing signature /api/webhooks/bitbucket', async () => {
    const webhookBody = {
      test: 'test',
      action: 'test',
    };

    try {
      await webhooksApi.webhooksControllerBitbucket(webhookBody);
    } catch (error) {
      const axiosError = (error || {}) as AxiosError;
      expect(axiosError.response?.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(axiosError.response?.data).toBeDefined();
      const errorData = (axiosError.response?.data || {}) as any;
      expect(errorData.message).toBe('No signature provided'); 
    }
  });
});
