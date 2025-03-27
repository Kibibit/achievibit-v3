import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Achievement } from './achievement.entity';
import { Integration } from './Integration.entity';
import { Organization } from './organization.entity';
import { UserSettings } from './user-settings.entity';
import { Role } from './authorization/roles.enum';
import { Permission } from './authorization/permissions.enum';

  @Entity('users', {
    comment: [
      'The users table contains the users of the application. ',
      'a user can be someone who logged in using OAuth, or an unregistered user ',
      'who got an achievement through a pull request on an integrated repository.'
    ].join('')
  })
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Expose({ groups: [ 'admin' ] })
      id: string;

    @CreateDateColumn()
    @Exclude()
    @ApiProperty()
      createdAt: Date;

    @Column()
    @Index({ unique: true })
    @ApiProperty()
      username: string;

    @Column()
    @ApiProperty()
      avatar: string;

    @Column()
    @Expose({ groups: [ 'admin', 'self' ] })
    @Index({ unique: true })
    @ApiPropertyOptional()
      email?: string;

    @Column({ default: false })
    @Expose({ groups: [ 'admin', 'self' ] })
    @ApiProperty()
      isOnboarded: boolean;

    @Expose({ groups: [ 'admin', 'self' ] })
    @Column({
      type: 'enum',
      enum: Role,
      array: true,
      default: [ Role.USER ]
    })
    @ApiProperty({
      enum: Role,
      isArray: true
    })
    roles: Role[];

    @Expose({ groups: [ 'admin', 'self' ] })
    // @Column({
    //   type: 'enum',
    //   enum: Permission,
    //   array: true,
    //   default: []
    // })
    @ApiProperty({
      enum: Permission,
      isArray: true
    })
    permissions: Permission[];

    @OneToMany(
      () => Integration,
      (integration) => integration.user,
      {
        cascade: true,
        eager: true
      }
    )
    @JoinColumn()
    @Type(() => Integration)
    @Transform(
      ({ value }) => (value as Integration[]).map((integration) => integration.system),
      { toPlainOnly: true }
    )
    @ApiProperty({
      type: () => Integration,
      isArray: true
    })
      integrations: Integration[];

    @OneToOne(
      () => UserSettings,
      (settings) => settings.user,
      {
        cascade: true,
        eager: true
      }
    )
    @JoinColumn()
    @Expose({ groups: [ 'admin', 'self' ] })
    @ApiProperty()
      settings: UserSettings;

    @ManyToMany(
      () => Organization,
      (organization) => organization.members
    )
    @Type(() => Organization)
    @Transform(
      ({ value }) => (value as Organization[]).map((organization) => organization.name),
      { toPlainOnly: true }
    )
    @ApiProperty({
      type: () => Organization,
      isArray: true
    })
      organizations: Organization[];

    @OneToMany(
      () => Achievement,
      (achievement) => achievement.user,
      {
        cascade: true,
        eager: true
      }
    )
    @JoinColumn()
    @Type(() => Achievement)
    @ApiProperty({
      type: () => Achievement,
      isArray: true
    })
      achievements: Achievement[];

    @Expose()
    @ApiProperty()
    get registered(): boolean {
      return this.integrations && this.integrations.length > 0;
    }

    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
}

export class CreateUser extends OmitType(User, [ 'id', 'createdAt', 'settings', 'permissions' ] as const) {}
