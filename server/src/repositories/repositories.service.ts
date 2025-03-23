import { FindOptionsWhere, ILike, MongoRepository, ObjectLiteral } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateRepository, PageMetaModel, PageModel, PageOptionsModel, Repository, SystemEnum } from '@kb-models';

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
    pageOptions: PageOptionsModel,
    where: ObjectLiteral | FindOptionsWhere<Repository> | FindOptionsWhere<Repository>[] = {}
  ) {
    const [ entities, itemCount ] = await this.reposRepository.findAndCount({
      where,
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

  async deleteRepo(fullname: string, system: SystemEnum) {
    return await this.reposRepository.delete({
      fullname,
      system
    });
  }
}
