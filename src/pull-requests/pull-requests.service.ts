import { MongoRepository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePullRequest, PageMetaModel, PageModel, PageOptionsModel, PullRequest } from '@kb-models';

@Injectable()
export class PullRequestsService {
  constructor(
    @InjectRepository(PullRequest)
    private readonly orgsRepository: MongoRepository<PullRequest>
  ) {}

  create(repo: CreatePullRequest) {
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
