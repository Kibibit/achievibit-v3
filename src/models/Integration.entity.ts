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
      id: ObjectId;

    @Column('enum', { enum: SystemEnum })
      system: SystemEnum;

    @Column()
      systemUsername: string;

    @Column()
      systemAvatar: string;

    @Column('json', { nullable: true })
      organizations: { orgId: string; orgName: string }[];

    @Column()
      accessToken: string;

    @Column()
      refreshToken: string;

    @Column()
      tokenExpiry: Date;

    @ManyToOne(() => User, (user) => user.integrations)
      user: User; // Relation to the User entity
}
