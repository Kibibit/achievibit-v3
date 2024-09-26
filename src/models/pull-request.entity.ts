import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { ApiProperty, OmitType } from '@nestjs/swagger';

import { SystemEnum } from './Integration.entity';

  @Entity('pull-requests')
export class PullRequest {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

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

    @Column()
    @ApiProperty()
      owner: string;

    constructor(partial: Partial<PullRequest>) {
      Object.assign(this, partial);
    }
}

export class CreatePullRequest extends OmitType(PullRequest, [ 'id', 'createdAt' ] as const) {}
