import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Integration } from './Integration.entity';
import { Organization } from './organization.entity';
import { UserSettings } from './user-settings.entity';
import { User } from './user.entity';
import { Repository } from './repository.entity';

@Entity('achievements', {
  comment: 'Holds the achievements of the users. This is a log of the achievements that the user has earned.',
})
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [ 'admin' ] })
    id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Exclude()
  @ApiProperty()
    createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Exclude()
  @ApiProperty()
    updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.achievements
  )
  @JoinColumn({ name: 'userId' })
  @Transform(({ value }) => value ? (value as User).username : null)
    user: User;

  @ManyToOne(
    () => Organization,
    // (user) => user.achievements,
  )
  @JoinColumn({ name: 'organizationId' })
  @Transform(({ value }) => value ? (value as Organization).name : null)
    organization?: Organization;

  @ManyToOne(
    () => Repository,
    // (user) => user.achievements,
  )
  @JoinColumn({ name: 'repositoryId' })
  @Transform(({ value }) => value ? (value as Repository).fullname : null)
    repository?: Repository;

  @Column({ comment: 'The related pull request URL that this achievement is associated with.' })
  @ApiProperty()
  @Transform((param) => {
    const repo = (param.obj as Achievement).repository;
    const isPrivate = repo && repo.private;

    return isPrivate ? null : param.value;
  })
    pullRequestUrl?: string;

  @Column({ comment: 'The avatar of the achievement. saved on each instance to prevent the avatar from changing.' })
  @ApiProperty()
    avatar?: string;

  constructor(partial: Partial<Achievement>) {
    Object.assign(this, partial);
  }
}

export class CreateAchievement extends OmitType(Achievement, [ 'id', 'createdAt' ] as const) {}
