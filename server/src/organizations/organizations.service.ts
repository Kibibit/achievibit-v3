import { MongoRepository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOrganization, Organization, PageMetaModel, PageModel, PageOptionsModel } from '@kb-models';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgsRepository: MongoRepository<Organization>
  ) {}

  create(repo: CreateOrganization) {
    return this.orgsRepository.save(repo);
  }

  async findAll(
    pageOptions: PageOptionsModel
  ) {
    const [ entities, itemCount ] = await this.orgsRepository.findAndCount({
      // Sorting by createdAt field
      order: { createdAt: pageOptions.order },
      skip: pageOptions.skip,
      take: pageOptions.take
    });

    const pageMeta = new PageMetaModel({ itemCount, pageOptionsModel: pageOptions });

    return new PageModel(entities, pageMeta);
  }

  async findById(name: string) {
    return await this.orgsRepository.findOne({
      where: { name }
    });
  }
}
