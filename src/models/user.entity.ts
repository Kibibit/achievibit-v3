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

import { Integration } from './Integration.entity';
import { Organization } from './organization.entity';
import { UserSettings } from './user-settings.entity';

  @Entity('users')
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

      @Expose()
      @ApiProperty()
    get registered(): boolean {
      return this.integrations && this.integrations.length > 0;
    }

      constructor(partial: Partial<User>) {
        Object.assign(this, partial);
      }
}

export class CreateUser extends OmitType(User, [ 'id', 'createdAt', 'settings' ] as const) {}
