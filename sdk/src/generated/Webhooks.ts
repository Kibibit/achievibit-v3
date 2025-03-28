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

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Webhooks<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Webhooks
   * @name WebhooksControllerBitbucket
   * @summary Endpoint for Bitbucket webhooks
   * @request POST:/api/webhooks/bitbucket
   * @secure
   */
  webhooksControllerBitbucket = (data: object, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/webhooks/bitbucket`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Webhooks
   * @name WebhooksControllerGithub
   * @summary Endpoint for GitHub webhooks
   * @request POST:/api/webhooks/github
   * @secure
   */
  webhooksControllerGithub = (data: object, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/webhooks/github`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Webhooks
   * @name WebhooksControllerGitlab
   * @summary Endpoint for GitLab webhooks
   * @request POST:/api/webhooks/gitlab
   * @secure
   */
  webhooksControllerGitlab = (data: object, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/webhooks/gitlab`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
