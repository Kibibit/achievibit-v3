/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiInfo {
  name: string;
  description: string;
  version: string;
  license: string;
  repository: string;
  author: string;
  bugs: string;
}

export interface PageMetaModel {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PageModel {
  data: any[][];
  meta: PageMetaModel;
}

export interface Integration {
  system: "github" | "gitlab" | "bitbucket";
  systemEmails: string[];
  systemUsername: string;
  systemAvatar: string;
  organizations: string[];
}

export interface UserSettings {
  timezone: string;
  dateFormat: string;
  avatarSystemOrigin: "github" | "gitlab" | "bitbucket";
  theme: "light" | "dark";
}

export interface Achievement {
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  pullRequestUrl: string;
  avatar: string;
}

export interface User {
  /** @format date-time */
  createdAt: string;
  username: string;
  avatar: string;
  email?: string;
  isOnboarded: boolean;
  integrations: Integration[];
  settings: UserSettings;
  organizations: Organization[];
  achievements: Achievement[];
  registered: boolean;
}

export interface Organization {
  /** @format date-time */
  createdAt: string;
  name: string;
  system: string;
  owner: User;
  members: User[];
}

export interface Repository {
  /** @format date-time */
  createdAt: string;
  name: string;
  system: string;
  owner: User;
  fullname: string;
  url: string;
  organization: Organization;
  private: boolean;
}

export interface SubPizza {
  somethingElse: string;
}

export interface Pizza {
  name: string;
  age: number;
  breed: string;
  something: SubPizza;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title achievibit-api
 * @version 1.0
 * @contact thatkookooguy <thatkookooguy@kibibit.io> (https://github.com/thatkookooguy)
 *
 * ![swagger-mode](https://img.shields.io/badge/mode-devcontainer-FF5BF8)
 *
 * The achievibit API description.
 *
 * Since this swagger shares the same domain as the app, you can use the same cookie for authentication.
 *
 * For the WebSocket API, please visit [achievibit-ws](/api/docs-async)
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetApiDetails
   * @summary Get API Information
   * @request GET:/api
   */
  appControllerGetApiDetails = (params: RequestParams = {}) =>
    this.request<ApiInfo, any>({
      path: `/api`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @name AppControllerGetSocketIo
   * @request GET:/socket.io
   */
  appControllerGetSocketIo = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/socket.io`,
      method: "GET",
      ...params,
    });

  swagger = {
    /**
     * No description
     *
     * @name AppControllerGetSmeeUrl
     * @summary Get Smee URL
     * @request GET:/api/swagger
     */
    appControllerGetSmeeUrl: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/swagger`,
        method: "GET",
        ...params,
      }),
  };
  pronunciation = {
    /**
     * No description
     *
     * @name AppControllerGetWordPronunciation
     * @summary Get Word Pronunciation for achievibit
     * @request GET:/api/pronunciation
     */
    appControllerGetWordPronunciation: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/pronunciation`,
        method: "GET",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Clears the `kibibit-jwt` cookie. This effectively logs out the user. **Note that the JWT token is still valid until it expires.**
     *
     * @tags Authentication
     * @name AuthControllerLogout
     * @summary Logout
     * @request GET:/api/auth/logout
     * @secure
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Redirects to Github OAuth flow for authentication
     *
     * @tags Authentication
     * @name GithubControllerGithubAuth
     * @summary Initiate Github OAuth flow
     * @request GET:/api/auth/github
     */
    githubControllerGithubAuth: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/github`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Github OAuth callback URL. This is the URL that Github will redirect to after authentication
     *
     * @tags Authentication
     * @name GithubControllerGithubAuthCallback
     * @summary Github OAuth callback
     * @request GET:/api/auth/github/callback
     */
    githubControllerGithubAuthCallback: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/github/callback`,
        method: "GET",
        ...params,
      }),
  };
  users = {
    /**
     * @description Returns a paginated list of all users
     *
     * @tags Users
     * @name UsersControllerGetUsers
     * @summary Get all users
     * @request GET:/api/users
     */
    usersControllerGetUsers: (
      query?: {
        /** @default "ASC" */
        order?: "ASC" | "DESC";
        /**
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * @min 1
         * @max 50
         * @default 10
         */
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PageModel & {
          data?: User[];
        },
        any
      >({
        path: `/api/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a user by ID
     *
     * @tags Users
     * @name UsersControllerGetUser
     * @summary Get user by ID
     * @request GET:/api/users/{id}
     */
    usersControllerGetUser: (id: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/users/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  me = {
    /**
     * @description Returns the current user. Requires a valid JWT token
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUser
     * @summary Get current user
     * @request GET:/api/me
     * @secure
     */
    sessionUserControllerGetSessionUser: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Clears the JWT cookie, and invalidates the JWT token
     *
     * @tags Session User
     * @name SessionUserControllerLogout
     * @summary Logout
     * @request GET:/api/me/logout
     * @secure
     */
    sessionUserControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/logout`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the current user settings. Requires a valid JWT token
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserSettings
     * @summary Get current user settings
     * @request GET:/api/me/settings
     * @secure
     */
    sessionUserControllerGetSessionUserSettings: (params: RequestParams = {}) =>
      this.request<UserSettings, any>({
        path: `/api/me/settings`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the current user settings. Requires a valid JWT token
     *
     * @tags Session User
     * @name SessionUserControllerUpdateSessionUserSettings
     * @summary Update current user settings
     * @request PATCH:/api/me/settings
     * @secure
     */
    sessionUserControllerUpdateSessionUserSettings: (data: UserSettings, params: RequestParams = {}) =>
      this.request<UserSettings, any>({
        path: `/api/me/settings`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Will return the currently integrated cloud git systems
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserIntegrations
     * @summary Get current user integrations
     * @request GET:/api/me/integrations
     * @secure
     */
    sessionUserControllerGetSessionUserIntegrations: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/integrations`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Will return the currently integrated cloud git system with related repositories
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserIntegration
     * @summary Get current user integration
     * @request GET:/api/me/integrations/{system}
     * @secure
     */
    sessionUserControllerGetSessionUserIntegration: (
      system: string,
      query: {
        /** The cloud git system to get the available repositories for */
        system: "github" | "gitlab" | "bitbucket";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/me/integrations/${system}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Will return the available repositories for all cloud git systems
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserAllAvailableRepositories
     * @summary Get available repositories
     * @request GET:/api/me/integrations/all/available
     * @secure
     */
    sessionUserControllerGetSessionUserAllAvailableRepositories: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/integrations/all/available`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Will return the available repositories for the given cloud git system
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserAvailableRepositories
     * @summary Get available repositories
     * @request GET:/api/me/integrations/{system}/available
     * @secure
     */
    sessionUserControllerGetSessionUserAvailableRepositories: (system: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/integrations/${system}/available`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Will return the currently installed GitHub Apps
     *
     * @tags Session User
     * @name SessionUserControllerGetSessionUserInstallations
     * @summary Get current user installations
     * @request GET:/api/me/installations
     * @secure
     */
    sessionUserControllerGetSessionUserInstallations: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/installations`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Will install a webhook on the given repository
     *
     * @tags Session User
     * @name SessionUserControllerInstallWebhookOnRepo
     * @summary Install webhook on repo
     * @request POST:/api/me/install/{system}/{repoFullName}
     * @secure
     */
    sessionUserControllerInstallWebhookOnRepo: (system: string, repoFullName: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/install/${system}/${repoFullName}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Will uninstall a webhook on the given repository
     *
     * @tags Session User
     * @name SessionUserControllerUninstallWebhookOnRepo
     * @summary Uninstall webhook on repo
     * @request DELETE:/api/me/install/{system}/{repoFullName}
     * @secure
     */
    sessionUserControllerUninstallWebhookOnRepo: (system: string, repoFullName: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/me/install/${system}/${repoFullName}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Will post install the GitHub App
     *
     * @tags Session User
     * @name SessionUserControllerPostInstallGithubApp
     * @summary Post install
     * @request GET:/api/me/github/post-install
     * @secure
     */
    sessionUserControllerPostInstallGithubApp: (
      query: {
        installation_id: number;
        setup_action: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/me/github/post-install`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  repos = {
    /**
     * @description Returns a paginated list of all repositories
     *
     * @tags Repositories
     * @name RepositoriesControllerGetRepos
     * @summary Get all repositories
     * @request GET:/api/repos
     */
    repositoriesControllerGetRepos: (
      query?: {
        /** @default "ASC" */
        order?: "ASC" | "DESC";
        /**
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * @min 1
         * @max 50
         * @default 10
         */
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PageModel & {
          data?: Repository[];
        },
        any
      >({
        path: `/api/repos`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a repository by its id
     *
     * @tags Repositories
     * @name RepositoriesControllerGetRepo
     * @summary Get repository by id
     * @request GET:/api/repos/{id}
     */
    repositoriesControllerGetRepo: (
      id: string,
      query: {
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/repos/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  orgs = {
    /**
     * @description Returns a paginated list of all pull requests
     *
     * @tags Organizations
     * @name OrganizationsControllerGetOrganizations
     * @summary Get all repositories
     * @request GET:/api/orgs
     */
    organizationsControllerGetOrganizations: (
      query?: {
        /** @default "ASC" */
        order?: "ASC" | "DESC";
        /**
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * @min 1
         * @max 50
         * @default 10
         */
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PageModel & {
          data?: Organization[];
        },
        any
      >({
        path: `/api/orgs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a pull requests by its id
     *
     * @tags Organizations
     * @name OrganizationsControllerGetOrganization
     * @summary Get repository by id
     * @request GET:/api/orgs/{id}
     */
    organizationsControllerGetOrganization: (
      id: string,
      query: {
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/orgs/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  webhooks = {
    /**
     * No description
     *
     * @tags Webhooks
     * @name WebhooksControllerBitbucket
     * @summary Endpoint for Bitbucket webhooks
     * @request POST:/api/webhooks/bitbucket
     * @secure
     */
    webhooksControllerBitbucket: (data: object, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/webhooks/bitbucket`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name WebhooksControllerGithub
     * @summary Endpoint for GitHub webhooks
     * @request POST:/api/webhooks/github
     * @secure
     */
    webhooksControllerGithub: (data: Pizza, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/webhooks/github`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name WebhooksControllerGitlab
     * @summary Endpoint for GitLab webhooks
     * @request POST:/api/webhooks/gitlab
     * @secure
     */
    webhooksControllerGitlab: (data: object, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/webhooks/gitlab`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  health = {
    /**
     * No description
     *
     * @tags Health
     * @name HealthControllerCheck
     * @request GET:/api/health
     */
    healthControllerCheck: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {} */
          error?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"}} */
          details?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
        },
        {
          /** @example "error" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"redis":{"status":"down","message":"Could not connect"}} */
          error?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"},"redis":{"status":"down","message":"Could not connect"}} */
          details?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
        }
      >({
        path: `/api/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
