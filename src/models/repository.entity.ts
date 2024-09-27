import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Organization } from './organization.entity';
import { SystemEnum } from './system.enum';
import { User } from './user.entity';

  @Entity('repositories')
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [ 'admin' ] })
    id: string;

  @CreateDateColumn()
  @Exclude()
  @ApiProperty()
    createdAt: Date;

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  readonly fullname: string;

  @ApiProperty()
  @IsString()
  @Column()
  readonly url: string;

  @ApiProperty({
    type: () => Organization
  })
  @IsString()
  @IsOptional()
  @ManyToOne(
    () => Organization,
    (organization) => organization.repositories
  )
  readonly organization: Organization;

  constructor(partial: Partial<Repository>) {
    Object.assign(this, partial);
  }
}

export class CreateRepository extends OmitType(Repository, [ 'id', 'createdAt' ] as const) {}
