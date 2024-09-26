import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';

import { ApiProperty, OmitType } from '@nestjs/swagger';

import { SystemEnum } from './Integration.entity';

  @Entity('organizations')
export class Organization {
    @ObjectIdColumn()
    @Expose({ groups: [ 'admin' ] })
      id: ObjectId;

    @CreateDateColumn()
    @Exclude()
    @ApiProperty()
      createdAt: Date;

    @Column()
    @Index({ unique: true })
    @ApiProperty()
      name: string;

    @Column()
    @ApiProperty()
      system: SystemEnum;

    @Column()
    @ApiProperty()
      owner: string;

    @Column()
    @ApiProperty()
      members: string[];

    constructor(partial: Partial<Organization>) {
      Object.assign(this, partial);
    }
}

export class CreateOrganization extends OmitType(Organization, [ 'id', 'createdAt' ] as const) {}
