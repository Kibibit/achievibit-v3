import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Repository } from './repository.entity';
import { SystemEnum } from './system.enum';
import { User } from './user.entity';

  @Entity('organizations')
export class Organization {
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
    name: string;

  @Column()
  @ApiProperty()
    system: SystemEnum;

  @ManyToOne(
    () => User,
    {
      cascade: true,
      eager: true
    }
  )
  @JoinColumn()
  @ApiProperty({
    type: () => User
  })
    owner: User;

  @ManyToMany(
    () => User,
    (user) => user.organizations,
    {
      cascade: true,
      eager: true
    }
  )
  @JoinTable()
  @Type(() => User)
  @Transform(
    ({ value }) => (value as User[]).map((user) => user.username),
    { toPlainOnly: true }
  )
  @ApiProperty({
    type: () => User,
    isArray: true
  })
    members: User[];

  @OneToMany(
    () => Repository,
    (repository) => repository.organization,
    {
      cascade: true,
      eager: true
    }
  )
  @JoinColumn()
  @Type(() => Repository)
  @Transform(
    ({ value }) => (value as Repository[]).map((repo) => repo.fullname),
    { toPlainOnly: true }
  )
    repositories: Repository[];

  constructor(partial: Partial<Organization>) {
    Object.assign(this, partial);
  }
}

export class CreateOrganization extends OmitType(Organization, [ 'id', 'createdAt' ] as const) {}
