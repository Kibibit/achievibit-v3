import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePullRequest, PageMetaModel, PageModel, PageOptionsModel, PrStatusEnum, PullRequest, SystemEnum } from '@kb-models';

@Injectable()
export class PullRequestsService {
  constructor(
    @InjectRepository(PullRequest)
    private readonly orgsRepository: Repository<PullRequest>
  ) {}

  create(repo: CreatePullRequest) {
    return this.orgsRepository.save(repo);
  }

  createMock() {
    return this.orgsRepository.save(new PullRequest({
      title: 'test',
      system: SystemEnum.GITHUB,
      description: 'test',
      assignees: [ 'test' ],
      reviewers: [ 'test' ],
      reviewComments: [ {
        id: 'test',
        reviewId: 'test',
        author: 'test',
        message: 'test',
        createdOn: 'test',
        edited: false,
        apiUrl: 'test',
        file: 'test',
        commit: 'test'
      } ],
      reviews: [ { test: 'test' } ],
      comments: [ { test: 'test' } ],
      inlineComments: [ { test: 'test' } ],
      commits: [ { test: 'test' } ],
      files: [ { test: 'test' } ],
      reactions: [ { test: 'test' } ],
      status: PrStatusEnum.OPEN
    }));
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
