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

import { PageModel, RepositoriesControllerGetReposParamsOrderEnum, Repository } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Repositories<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns a paginated list of all repositories
   *
   * @tags Repositories
   * @name RepositoriesControllerGetRepos
   * @summary Get all repositories
   * @request GET:/api/repos
   */
  repositoriesControllerGetRepos = (
    query?: {
      /** @default "" */
      query?: string;
      /** @default "ASC" */
      order?: RepositoriesControllerGetReposParamsOrderEnum;
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
    });
  /**
   * @description Returns a repository by its fullname
   *
   * @tags Repositories
   * @name RepositoriesControllerGetRepo
   * @summary Get repository by fullname
   * @request GET:/api/repos/{owner}/{name}
   */
  repositoriesControllerGetRepo = (owner: string, name: string, params: RequestParams = {}) =>
    this.request<Repository, any>({
      path: `/api/repos/${owner}/${name}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
