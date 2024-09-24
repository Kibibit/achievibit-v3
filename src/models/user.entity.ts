import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  OneToMany
} from 'typeorm';

import { Integration } from './Integration.entity';

  @Entity('users')
export class User {
    @ObjectIdColumn()
      id: ObjectId;

    @Column({ unique: true })
      username: string;

    @Column()
      avatar: string;

    @Column({ nullable: true })
      email?: string;

    @OneToMany(() => Integration, (integration) => integration.user, {
      // Automatically manage integration relations
      cascade: true
    })
      integrations: Integration[];
}
