import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { User } from './user.entity';

export enum SystemEnum {
    GITHUB = 'github',
    GITLAB = 'gitlab',
    BITBUCKET = 'bitbucket'
  }

  @Entity('integrations')
export class Integration {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

    @Column('enum', { enum: SystemEnum })
      system: SystemEnum;

    @Column()
      systemEmails: string[];

    @Column()
      systemUsername: string;

    @Column()
      systemAvatar: string;

    @Column('json', { nullable: true })
      organizations: { orgId: string; orgName: string }[];

    @Column()
    @Exclude()
      accessToken: string;

    @Column()
    @Exclude()
      refreshToken: string;

    @Column()
    @Exclude()
      tokenExpiry: Date;

    // Relation to the User entity
    @ManyToOne(() => User, (user) => user.integrations)
      user: User;

    constructor(partial: Partial<Integration>) {
      Object.assign(this, partial);
    }
}
