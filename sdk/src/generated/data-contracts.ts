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

export interface KbTimezone {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}

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
  system: IntegrationSystemEnum;
  systemEmails: string[];
  systemUsername: string;
  systemAvatar: string;
  organizations: string[];
}

export interface UserSettings {
  timezone: string;
  dateFormat: string;
  avatarSystemOrigin: UserSettingsAvatarSystemOriginEnum;
  theme: UserSettingsThemeEnum;
}

export interface Achievement {
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  pullRequestUrl: string;
  avatar: string;
  name: string;
  description: string;
  treasure: Record<string, any>;
}

export interface User {
  /** @format date-time */
  createdAt: string;
  username: string;
  avatar: string;
  email?: string;
  isOnboarded: boolean;
  roles: UserRolesEnum[];
  permissions: UserPermissionsEnum[];
  lives: number;
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
  avatar: string;
  system: string;
  owner: User;
  fullname: string;
  url: string;
  organization: Organization;
  organizationName: object;
  private: boolean;
}

export enum IntegrationSystemEnum {
  Github = "github",
  Gitlab = "gitlab",
  Bitbucket = "bitbucket",
}

export enum UserSettingsAvatarSystemOriginEnum {
  Github = "github",
  Gitlab = "gitlab",
  Bitbucket = "bitbucket",
}

export enum UserSettingsThemeEnum {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export enum UserRolesEnum {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

export enum UserPermissionsEnum {
  ViewPullRequests = "view:pull-requests",
}

/** @default "ASC" */
export enum UsersControllerGetUsersParamsOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

/** The cloud git system to get the available repositories for */
export enum SessionUserControllerGetSessionUserIntegrationParamsSystemEnum {
  Github = "github",
  Gitlab = "gitlab",
  Bitbucket = "bitbucket",
}

/** @default "ASC" */
export enum RepositoriesControllerGetReposParamsOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

/** @default "ASC" */
export enum OrganizationsControllerGetOrganizationsParamsOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}
