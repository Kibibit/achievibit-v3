import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { OmitType } from '@nestjs/swagger';

import { Integration } from './Integration.entity';

  @Entity('users')
export class User {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

    @CreateDateColumn()
    @Exclude()
      createdAt: Date;

    @Column()
    @Index({ unique: true })
      username: string;

    @Column()
      avatar: string;

    @Column()
    @Expose({ groups: [ 'admin', 'self' ] })
    @Index({ unique: true })
      email?: string;

    @ObjectIdColumn({
      name: 'integrations',
      array: true
    })
    @Type(() => Integration)
    @Transform(
      ({ value }) => (value as Integration[]).map((integration) => integration.system),
      { toPlainOnly: true }
    )
      integrations: Integration[];

    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
}

export class CreateUser extends OmitType(User, [ 'id', 'createdAt' ] as const) {}
