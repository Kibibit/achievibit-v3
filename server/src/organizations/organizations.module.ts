import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Organization } from '@kb-models';

import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Organization ])
  ],
  controllers: [ OrganizationsController ],
  providers: [ OrganizationsService ],
  exports: [ OrganizationsService ]
})
export class OrganizationsModule {}
