import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { SystemEnum } from './system.enum';
import { User } from './user.entity';

@Entity('integrations', {
  comment: [
    'The integrations table contains the user integrations with git systems. ',
    'This table represents the OAuth2 integrations with the git systems.'
  ].join('')
})
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [ 'admin' ] })
    id: string;

  @Column('enum', { enum: SystemEnum })
  @ApiProperty({ enum: SystemEnum })
    system: SystemEnum;

  @Column('text', { array: true })
  @ApiProperty()
    systemEmails: string[];

  @Column()
  @ApiProperty()
    systemUsername: string;

  @Column()
  @ApiProperty()
    systemAvatar: string;

  @Column('json', { nullable: true })
  @ApiProperty()
    organizations: { orgId: string; orgName: string }[];

  @Column()
  @Exclude()
    accessToken: string;

  @Column({ nullable: true })
  @Exclude()
    refreshToken: string;

  @Column({ nullable: true })
  @Exclude()
    tokenExpiry: Date;

  // Relation to the User entity
  @ManyToOne(() => User, (user) => user.integrations)
  @JoinColumn({ name: 'userId' })
    user: User;

  constructor(partial: Partial<Integration>) {
    Object.assign(this, partial);
  }
}
