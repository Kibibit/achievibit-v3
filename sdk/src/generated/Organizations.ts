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

import { Organization, OrganizationsControllerGetOrganizationsParamsOrderEnum, PageModel } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Organizations<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns a paginated list of all pull requests
   *
   * @tags Organizations
   * @name OrganizationsControllerGetOrganizations
   * @summary Get all repositories
   * @request GET:/api/orgs
   */
  organizationsControllerGetOrganizations = (
    query?: {
      /** @default "" */
      query?: string;
      /** @default "ASC" */
      order?: OrganizationsControllerGetOrganizationsParamsOrderEnum;
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
    });
  /**
   * @description Returns a pull requests by its id
   *
   * @tags Organizations
   * @name OrganizationsControllerGetOrganization
   * @summary Get repository by id
   * @request GET:/api/orgs/{id}
   */
  organizationsControllerGetOrganization = (id: string, params: RequestParams = {}) =>
    this.request<Organization, any>({
      path: `/api/orgs/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
