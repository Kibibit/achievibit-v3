import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Integration } from './Integration.entity';
import { UserSettings } from './user-settings.entity';

  @Entity('users')
export class User {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
    // @ApiProperty({
    //   type: ObjectId
    // })
      id: ObjectId;

    @CreateDateColumn()
    @Exclude()
    @ApiProperty()
      createdAt: Date;

    @Column()
    @Index({ unique: true })
    @ApiProperty()
      username: string;

    @Column()
    @ApiProperty()
      avatar: string;

    @Column()
    @Expose({ groups: [ 'admin', 'self' ] })
    @Index({ unique: true })
    @ApiPropertyOptional()
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
    @ApiProperty({
      type: Integration,
      isArray: true
    })
      integrations: Integration[];

    @Column()
    @Expose({ groups: [ 'admin', 'self' ] })
    @ApiProperty()
    settings: UserSettings;

    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
}

export class CreateUser extends OmitType(User, [ 'id', 'createdAt', 'settings' ] as const) {}
