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

import { PageModel, User, UsersControllerGetUsersParamsOrderEnum } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Users<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns a paginated list of all users
   *
   * @tags Users
   * @name UsersControllerGetUsers
   * @summary Get all users
   * @request GET:/api/users
   */
  usersControllerGetUsers = (
    query?: {
      /** @default "" */
      query?: string;
      /** @default "ASC" */
      order?: UsersControllerGetUsersParamsOrderEnum;
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
    });
  /**
   * @description Returns a user by ID
   *
   * @tags Users
   * @name UsersControllerGetUser
   * @summary Get user by ID
   * @request GET:/api/users/{id}
   */
  usersControllerGetUser = (id: string, params: RequestParams = {}) =>
    this.request<User, any>({
      path: `/api/users/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
