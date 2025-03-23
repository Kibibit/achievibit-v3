import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@kb-decorators';
import { Organization, PageOptionsModel } from '@kb-models';

import { OrganizationsService } from './organizations.service';
import { ILike } from 'typeorm';

@Controller('api/orgs')
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
  @ApiOkResponsePaginated(Organization)
  async getOrganizations(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.organizationsService.findAll(pageOptions, {
      name: ILike(`%${pageOptions.query}%`)
    });
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
