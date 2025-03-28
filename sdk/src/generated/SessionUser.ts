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

import { SessionUserControllerGetSessionUserIntegrationParamsSystemEnum, User, UserSettings } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class SessionUser<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns the current user. Requires a valid JWT token
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUser
   * @summary Get current user
   * @request GET:/api/me
   * @secure
   */
  sessionUserControllerGetSessionUser = (params: RequestParams = {}) =>
    this.request<User, any>({
      path: `/api/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Clears the JWT cookie, and invalidates the JWT token
   *
   * @tags Session User
   * @name SessionUserControllerLogout
   * @summary Logout
   * @request GET:/api/me/logout
   * @secure
   */
  sessionUserControllerLogout = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/logout`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Returns the current user settings. Requires a valid JWT token
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserSettings
   * @summary Get current user settings
   * @request GET:/api/me/settings
   * @secure
   */
  sessionUserControllerGetSessionUserSettings = (params: RequestParams = {}) =>
    this.request<UserSettings, any>({
      path: `/api/me/settings`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates the current user settings. Requires a valid JWT token
   *
   * @tags Session User
   * @name SessionUserControllerUpdateSessionUserSettings
   * @summary Update current user settings
   * @request PATCH:/api/me/settings
   * @secure
   */
  sessionUserControllerUpdateSessionUserSettings = (data: UserSettings, params: RequestParams = {}) =>
    this.request<UserSettings, any>({
      path: `/api/me/settings`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Will return the currently integrated cloud git systems
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserIntegrations
   * @summary Get current user integrations
   * @request GET:/api/me/integrations
   * @secure
   */
  sessionUserControllerGetSessionUserIntegrations = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/integrations`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Will return the currently integrated cloud git system with related repositories
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserIntegration
   * @summary Get current user integration
   * @request GET:/api/me/integrations/{system}
   * @secure
   */
  sessionUserControllerGetSessionUserIntegration = (
    system: string,
    query: {
      /** The cloud git system to get the available repositories for */
      system: SessionUserControllerGetSessionUserIntegrationParamsSystemEnum;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/me/integrations/${system}`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description Will return the available repositories for all cloud git systems
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserAllAvailableRepositories
   * @summary Get available repositories
   * @request GET:/api/me/integrations/all/available
   * @secure
   */
  sessionUserControllerGetSessionUserAllAvailableRepositories = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/integrations/all/available`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Will return the available repositories for the given cloud git system
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserAvailableRepositories
   * @summary Get available repositories
   * @request GET:/api/me/integrations/{system}/available
   * @secure
   */
  sessionUserControllerGetSessionUserAvailableRepositories = (system: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/integrations/${system}/available`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Will return the currently installed GitHub Apps
   *
   * @tags Session User
   * @name SessionUserControllerGetSessionUserInstallations
   * @summary Get current user installations
   * @request GET:/api/me/installations
   * @secure
   */
  sessionUserControllerGetSessionUserInstallations = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/installations`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Will install a webhook on the given repository
   *
   * @tags Session User
   * @name SessionUserControllerInstallWebhookOnRepo
   * @summary Install webhook on repo
   * @request POST:/api/me/install/{system}/{repoFullName}
   * @secure
   */
  sessionUserControllerInstallWebhookOnRepo = (system: string, repoFullName: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/install/${system}/${repoFullName}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description Will uninstall a webhook on the given repository
   *
   * @tags Session User
   * @name SessionUserControllerUninstallWebhookOnRepo
   * @summary Uninstall webhook on repo
   * @request DELETE:/api/me/install/{system}/{repoFullName}
   * @secure
   */
  sessionUserControllerUninstallWebhookOnRepo = (system: string, repoFullName: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/me/install/${system}/${repoFullName}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Will post install the GitHub App
   *
   * @tags Session User
   * @name SessionUserControllerPostInstallGithubApp
   * @summary Post install
   * @request GET:/api/me/github/post-install
   * @secure
   */
  sessionUserControllerPostInstallGithubApp = (
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
    });
}
