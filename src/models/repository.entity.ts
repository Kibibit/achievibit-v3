import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { OmitType } from '@nestjs/swagger';

import { SystemEnum } from './Integration.entity';

  @Entity('repositories')
export class Repository {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

    @CreateDateColumn()
    @Exclude()
      createdAt: Date;

    @Column()
    @Index({ unique: true })
      name: string;

    @Column()
      system: SystemEnum;

    @Column()
      owner: string;

    constructor(partial: Partial<Repository>) {
      Object.assign(this, partial);
    }
}

export class CreateRepository extends OmitType(Repository, [ 'id', 'createdAt' ] as const) {}
