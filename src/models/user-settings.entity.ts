import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { SystemEnum } from './Integration.entity';

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark'
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

    @Column('enum', { enum: ThemeEnum })
    @ApiProperty({ enum: ThemeEnum })
      theme: ThemeEnum;

    constructor(partial: Partial<UserSettings>) {
      Object.assign(this, partial);
    }
}
