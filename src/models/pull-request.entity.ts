import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Organization } from './organization.entity';
import { PrStatusEnum } from './pr-status.enum';
import { SystemEnum } from './system.enum';
import { User } from './user.entity';

export interface IReviewComment {
  id: string;
  reviewId: string;
  author: string;
  message: string;
  createdOn: string;
  edited: boolean;
  apiUrl: string;
  file: string;
  commit: string;
}

  @Entity('pull-requests')
export class PullRequest {
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
      nullable: true,
      cascade: true,
      eager: true
    }
  )
  @JoinColumn()
  @ApiPropertyOptional({
    type: () => User
  })
    ownerUser?: User;

  @ApiProperty()
  @Column()
    prid: string;

  @Expose()
  @IsString()
  @Column()
    url: string;

  @Expose()
  @IsNumber()
  @Column()
    number: number;

  @Expose()
  @IsString()
  @Column()
    title: string;

  @Expose()
  @IsString()
  @Column()
    description: string;

  @Expose()
  @IsString()
  @Column()
    creator: string;

  @Expose()
  @Column()
    createdOn: Date;

  @Expose()
  @Column('text', { array: true })
    labels: string[];

  @Expose()
  @Column('json', { nullable: true })
    history: {
    [ key: string ]: any;
  };

  @Expose()
  @Column()
    repository: string;

  @ManyToOne(
    () => Organization,
    {
      nullable: true,
      cascade: true,
      eager: true
    }
  )
  @JoinColumn()
  @ApiPropertyOptional({
    type: () => Organization
  })
    organization?: Organization;

  @Expose()
  @IsOptional()
  @Column('text', { array: true })
    assignees?: string[];

  @Expose()
  @IsOptional()
  @Column('text', { array: true })
    reviewers?: string[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    reviewComments?: IReviewComment[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    reviews?: any[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    comments?: any[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    inlineComments?: any[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    commits?: any[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    files?: any[];

  @Expose()
  @IsOptional()
  @Column('json', { nullable: true, array: true })
    reactions?: any[];

  @Expose()
  @Column({ enum: PrStatusEnum, default: PrStatusEnum.OPEN })
    status: PrStatusEnum;

  constructor(partial: Partial<PullRequest>) {
    Object.assign(this, partial);
  }
}

export class CreatePullRequest extends OmitType(PullRequest, [ 'id', 'createdAt' ] as const) {}
