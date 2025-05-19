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

import { ApiInfo, KbTimezone } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
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
   * @name AppControllerGetTimezones
   * @summary Get Supported Timezones
   * @request GET:/api/timezones
   */
  appControllerGetTimezones = (params: RequestParams = {}) =>
    this.request<Record<string, KbTimezone>, any>({
      path: `/api/timezones`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name AppControllerGetDevCenterOptions
   * @summary Get Dev Center Options
   * @request GET:/api/swagger
   */
  appControllerGetDevCenterOptions = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/api/swagger`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @name AppControllerGetWordPronunciation
   * @summary Get Word Pronunciation for achievibit
   * @request GET:/api/pronunciation
   */
  appControllerGetWordPronunciation = (params: RequestParams = {}) =>
    this.request<File, any>({
      path: `/api/pronunciation`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @name PrometheusControllerIndex
   * @request GET:/api/metrics
   */
  prometheusControllerIndex = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/metrics`,
      method: "GET",
      ...params,
    });
}
