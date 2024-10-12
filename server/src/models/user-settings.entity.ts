import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { SystemEnum } from './system.enum';
import { User } from './user.entity';

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

  @Entity('user-settings', {
    comment: [
      'The user settings are used to customize the user experience.'
    ].join('')
  })
export class UserSettings {
    @PrimaryGeneratedColumn('uuid')
    @Expose({ groups: [ 'admin' ] })
      id: string;

    @Column()
    @ApiProperty()
      timezone: string;

    @Column()
    @ApiProperty()
      dateFormat: string;

    @Column({
      type: 'enum',
      enum: SystemEnum
    })
    @ApiProperty({ enum: SystemEnum })
      avatarSystemOrigin: SystemEnum;

    @Column('enum', { enum: ThemeEnum })
    @ApiProperty({ enum: ThemeEnum })
      theme: ThemeEnum;

    @OneToOne(() => User, (user) => user.settings)
      user: User;

    constructor(partial: Partial<UserSettings>) {
      Object.assign(this, partial);
    }
}
