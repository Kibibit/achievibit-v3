import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';


export enum SystemEnum {
    GITHUB = 'github',
    GITLAB = 'gitlab',
    BITBUCKET = 'bitbucket'
  }

  @Entity('user-settings')
export class UserSettings {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

    @Column()
    @ApiProperty()
      timezone: string;

    @Column()
    @ApiProperty()
      dateFormat: string;

    @Column('enum', { enum: SystemEnum })
    @ApiProperty({ enum: SystemEnum })
      avatarSystemOrigin: SystemEnum;

    constructor(partial: Partial<UserSettings>) {
      Object.assign(this, partial);
    }
}
