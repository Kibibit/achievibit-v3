import { FindOptionsWhere, ILike, MongoRepository, ObjectLiteral } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateRepository, PageMetaModel, PageModel, PageOptionsModel, Repository, SystemEnum } from '@kb-models';
import { OpenaiService } from '../openai/openai.service';
import { Logger } from '@kb-config';

@Injectable()
export class RepositoriesService {
  private readonly logger = new Logger(RepositoriesService.name);
  
  constructor(
    @InjectRepository(Repository)
    private readonly reposRepository: MongoRepository<Repository>,
    private readonly openaiService: OpenaiService
  ) {}

  async generateAvatar(repoName: string, description: string, languages: string[]) {
    const generatedAvatarBase64 = await this.openaiService.generateAvatar(repoName, description, languages);
    this.logger.verbose('Generated avatar', {
      repoName,
      description,
      languages,
      // logging only the first 10 characters of the base64 string
      truncatedBase64: generatedAvatarBase64.substring(0, 10) + '...'
    });
      
    return generatedAvatarBase64;
  }

  async create(repo: CreateRepository, description?: string, languages?: string[]) {
    if (!repo.avatar && description && languages) {
      const generatedAvatarBase64 = await this.generateAvatar(repo.name, description, languages);

      repo.avatar = generatedAvatarBase64;
    }

    return this.reposRepository.save(repo);
  }

  async findAll(
    pageOptions: PageOptionsModel,
    where: ObjectLiteral | FindOptionsWhere<Repository> | FindOptionsWhere<Repository>[] = {}
  ) {
    const [ entities, itemCount ] = await this.reposRepository.findAndCount({
      where,
      relations: [ 'organization' ],
      // Sorting by createdAt field
      order: { createdAt: pageOptions.order },
      skip: pageOptions.skip,
      take: pageOptions.take
    });

    const pageMeta = new PageMetaModel({ itemCount, pageOptionsModel: pageOptions });

    return new PageModel(entities, pageMeta);
  }

  async findByFullname(owner: string, name: string) {
    return await this.reposRepository.findOne({
      where: {
        name,
        fullname: `${owner}/${name}`
      }
    });
  }

  async deleteRepo(fullname: string, system: SystemEnum) {
    return await this.reposRepository.delete({
      fullname,
      system
    });
  }
}
