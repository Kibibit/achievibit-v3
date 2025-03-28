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

import { HttpClient, RequestParams } from "./http-client";

export class Authentication<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Clears the `kibibit-jwt` cookie. This effectively logs out the user. **Note that the JWT token is still valid until it expires.**
   *
   * @tags Authentication
   * @name AuthControllerLogout
   * @summary Logout
   * @request GET:/api/auth/logout
   * @secure
   */
  authControllerLogout = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/auth/logout`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Redirects to Github OAuth flow for authentication
   *
   * @tags Authentication
   * @name GithubControllerGithubAuth
   * @summary Initiate Github OAuth flow
   * @request GET:/api/auth/github
   */
  githubControllerGithubAuth = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/auth/github`,
      method: "GET",
      ...params,
    });
  /**
   * @description Github OAuth callback URL. This is the URL that Github will redirect to after authentication
   *
   * @tags Authentication
   * @name GithubControllerGithubAuthCallback
   * @summary Github OAuth callback
   * @request GET:/api/auth/github/callback
   */
  githubControllerGithubAuthCallback = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/auth/github/callback`,
      method: "GET",
      ...params,
    });
}
