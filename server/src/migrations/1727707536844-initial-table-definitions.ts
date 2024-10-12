import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTableDefinitions1727707536844 implements MigrationInterface {
  name = 'InitialTableDefinitions1727707536844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."integrations_system_enum" AS ENUM(\'github\', \'gitlab\', \'bitbucket\')');
    await queryRunner.query('CREATE TABLE "integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "system" "public"."integrations_system_enum" NOT NULL, "systemEmails" text array NOT NULL, "systemUsername" character varying NOT NULL, "systemAvatar" character varying NOT NULL, "organizations" json, "accessToken" character varying NOT NULL, "refreshToken" character varying, "tokenExpiry" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_9adcdc6d6f3922535361ce641e8" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "repositories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "system" character varying NOT NULL, "fullname" character varying NOT NULL, "url" character varying NOT NULL, "ownerId" uuid, "organizationId" uuid, CONSTRAINT "PK_ef0c358c04b4f4d29b8ca68ddff" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_98b624f19034b52b7d4a646b0c" ON "repositories" ("name") ');
    await queryRunner.query('CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "system" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_9b7ca6d30b94fef571cff87688" ON "organizations" ("name") ');
    await queryRunner.query('CREATE TYPE "public"."user-settings_avatarsystemorigin_enum" AS ENUM(\'github\', \'gitlab\', \'bitbucket\')');
    await queryRunner.query('CREATE TYPE "public"."user-settings_theme_enum" AS ENUM(\'light\', \'dark\')');
    await queryRunner.query('CREATE TABLE "user-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timezone" character varying NOT NULL, "dateFormat" character varying NOT NULL, "avatarSystemOrigin" "public"."user-settings_avatarsystemorigin_enum" NOT NULL, "theme" "public"."user-settings_theme_enum" NOT NULL, CONSTRAINT "PK_0fbe28c9f064a04d90aca6b3514" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "avatar" character varying NOT NULL, "email" character varying NOT NULL, "settingsId" uuid, CONSTRAINT "REL_76ba283779c8441fd5ff819c8c" UNIQUE ("settingsId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") ');
    await queryRunner.query('CREATE TABLE "pull-requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "system" character varying NOT NULL, "prid" character varying NOT NULL, "url" character varying NOT NULL, "number" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "creator" character varying NOT NULL, "createdOn" TIMESTAMP NOT NULL, "labels" text array NOT NULL, "history" json, "repository" character varying NOT NULL, "assignees" text array NOT NULL, "reviewers" text array NOT NULL, "reviewComments" json array, "reviews" json array, "comments" json array, "inlineComments" json array, "commits" json array, "files" json array, "reactions" json array, "status" character varying NOT NULL DEFAULT \'OPEN\', "ownerUserId" uuid, "organizationId" uuid, CONSTRAINT "PK_3ea4e8bd2a3afddb93998a615f5" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_2d5e7ad58855cd5ffc651e9f89" ON "pull-requests" ("name") ');
    await queryRunner.query('CREATE TABLE "organizations_members_users" ("organizationsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_717edbacb02a54277562e034fa3" PRIMARY KEY ("organizationsId", "usersId"))');
    await queryRunner.query('CREATE INDEX "IDX_a7f65f144e59145649bb180d86" ON "organizations_members_users" ("organizationsId") ');
    await queryRunner.query('CREATE INDEX "IDX_f14ee367211140e2985a71e72e" ON "organizations_members_users" ("usersId") ');
    await queryRunner.query('ALTER TABLE "users" ADD "description" character varying NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ADD "testWithMaor" character varying NOT NULL');
    await queryRunner.query('ALTER TABLE "integrations" ADD CONSTRAINT "FK_c32758a01d05d0d1da56fa46ae1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "repositories" ADD CONSTRAINT "FK_5d9b5135692dca8d36418f29b76" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "repositories" ADD CONSTRAINT "FK_a92455e763dc68b99ae99f174df" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "organizations" ADD CONSTRAINT "FK_cdf778d13ea7fe8095e013e34f0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_76ba283779c8441fd5ff819c8cf" FOREIGN KEY ("settingsId") REFERENCES "user-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "pull-requests" ADD CONSTRAINT "FK_be0d96fd7604f4d15a5574ed99b" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "pull-requests" ADD CONSTRAINT "FK_bbd2cdf7de67f783268ebdf811f" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "organizations_members_users" ADD CONSTRAINT "FK_a7f65f144e59145649bb180d864" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "organizations_members_users" ADD CONSTRAINT "FK_f14ee367211140e2985a71e72e1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "organizations_members_users" DROP CONSTRAINT "FK_f14ee367211140e2985a71e72e1"');
    await queryRunner.query('ALTER TABLE "organizations_members_users" DROP CONSTRAINT "FK_a7f65f144e59145649bb180d864"');
    await queryRunner.query('ALTER TABLE "pull-requests" DROP CONSTRAINT "FK_bbd2cdf7de67f783268ebdf811f"');
    await queryRunner.query('ALTER TABLE "pull-requests" DROP CONSTRAINT "FK_be0d96fd7604f4d15a5574ed99b"');
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_76ba283779c8441fd5ff819c8cf"');
    await queryRunner.query('ALTER TABLE "organizations" DROP CONSTRAINT "FK_cdf778d13ea7fe8095e013e34f0"');
    await queryRunner.query('ALTER TABLE "repositories" DROP CONSTRAINT "FK_a92455e763dc68b99ae99f174df"');
    await queryRunner.query('ALTER TABLE "repositories" DROP CONSTRAINT "FK_5d9b5135692dca8d36418f29b76"');
    await queryRunner.query('ALTER TABLE "integrations" DROP CONSTRAINT "FK_c32758a01d05d0d1da56fa46ae1"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "testWithMaor"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "description"');
    await queryRunner.query('DROP INDEX "public"."IDX_f14ee367211140e2985a71e72e"');
    await queryRunner.query('DROP INDEX "public"."IDX_a7f65f144e59145649bb180d86"');
    await queryRunner.query('DROP TABLE "organizations_members_users"');
    await queryRunner.query('DROP INDEX "public"."IDX_2d5e7ad58855cd5ffc651e9f89"');
    await queryRunner.query('DROP TABLE "pull-requests"');
    await queryRunner.query('DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"');
    await queryRunner.query('DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "user-settings"');
    await queryRunner.query('DROP TYPE "public"."user-settings_theme_enum"');
    await queryRunner.query('DROP TYPE "public"."user-settings_avatarsystemorigin_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_9b7ca6d30b94fef571cff87688"');
    await queryRunner.query('DROP TABLE "organizations"');
    await queryRunner.query('DROP INDEX "public"."IDX_98b624f19034b52b7d4a646b0c"');
    await queryRunner.query('DROP TABLE "repositories"');
    await queryRunner.query('DROP TABLE "integrations"');
    await queryRunner.query('DROP TYPE "public"."integrations_system_enum"');
  }
}
