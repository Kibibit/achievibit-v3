import { MongoRepository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateRepository, PageMetaModel, PageModel, PageOptionsModel, Repository } from '@kb-models';

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectRepository(Repository)
    private readonly reposRepository: MongoRepository<Repository>
  ) {}

  create(repo: CreateRepository) {
    return this.reposRepository.save(repo);
  }

  async findAll(
    pageOptions: PageOptionsModel
  ) {
    const [ entities, itemCount ] = await this.reposRepository.findAndCount({
      // Sorting by createdAt field
      order: { createdAt: pageOptions.order },
      skip: pageOptions.skip,
      take: pageOptions.take
    });

    const pageMeta = new PageMetaModel({ itemCount, pageOptionsModel: pageOptions });

    return new PageModel(entities, pageMeta);
  }

  async findById(name: string) {
    return await this.reposRepository.findOne({
      where: { name }
    });
  }
}
