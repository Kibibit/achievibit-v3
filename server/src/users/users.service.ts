
import { Repository } from 'typeorm';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUser, PageMetaModel, PageModel, PageOptionsModel, SystemEnum, User } from '@kb-models';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  create(user: CreateUser) {
    return this.usersRepository.save(user);
  }

  async updateIntegrations(username: string, loginIntegration: any) {
    const user = await this.findOne(username);

    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }

    const existingIntegration = user.integrations
      .find((integration) => integration.system === loginIntegration.system);

    if (existingIntegration) {
      existingIntegration.accessToken = loginIntegration.accessToken || existingIntegration.accessToken;
      existingIntegration.refreshToken = loginIntegration.refreshToken || existingIntegration.refreshToken;

      return await this.usersRepository.save(user);
    }

    user.integrations.push(loginIntegration);

    return await this.usersRepository.save(user);
  }

  async findAll(
    pageOptions: PageOptionsModel
  ) {
    const [ entities, itemCount ] = await this.usersRepository.findAndCount({
      // Sorting by createdAt field
      order: { createdAt: pageOptions.order },
      skip: pageOptions.skip,
      take: pageOptions.take
    });

    const pageMeta = new PageMetaModel({ itemCount, pageOptionsModel: pageOptions });

    return new PageModel(entities, pageMeta);
  }

  findOne(username: string) {
    return this.usersRepository.findOne({
      where: {
        username
      },
      relations: [ 'integrations' ]
    });
  }

  findOneByIntegration(integrationUsername: string, integration: SystemEnum) {
    return this.usersRepository.findOne({
      where: {
        integrations: {
          systemUsername: integrationUsername,
          system: integration
        }
      }
    });
  }
}
