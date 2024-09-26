import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageOptionsModel } from '@kb-models';

import { OrganizationsService } from './organizations.service';

@Controller('orgs')
@ApiTags('Organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all repositories',
    description: 'Returns a paginated list of all pull requests'
  })
  async getOrganizations(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.organizationsService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get repository by id',
    description: 'Returns a pull requests by its id'
  })
  async getOrganization(
    @Query('id') id: string
  ) {
    return await this.organizationsService.findById(id);
  }
}
