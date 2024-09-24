
import { omit } from 'lodash';
import { SystemEnum } from 'src/models/Integration.entity';
import { MongoRepository } from 'typeorm';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUser, User } from '@kb-models';

// This should be a real class/interface representing a user entity
export interface IUser {
  userId: number;
  username: string;
  provider: string;
  accessToken?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>
  ) {}
  private readonly users: IUser[] = [
    {
      userId: 10427304,
      username: 'thatkookooguy',
      provider: 'github'
    }
  ];

  create(user: CreateUser) {
    return this.usersRepository.save(user);
  }

  async updateIntegrations(username: string, integrations: any) {
    const user = await this.findOne(username);

    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }

    user.integrations.push(integrations);

    return await this.usersRepository.updateOne({
      username
    }, {
      $set: {
        integrations: user.integrations
      }
    });
  }

  findAll() {
    return this.users.map((user) => omit(user, [ 'accessToken', 'refreshToken' ]));
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

  updateAccessToken(username: string, accessToken: string) {
    const user = this.users.find((user) => user.username === username);
    if (user) {
      user.accessToken = accessToken;
    }
  }

  getAccessToken(username: string) {
    const user = this.users.find((user) => user.username === username);
    if (user) {
      return user.accessToken;
    }
  }
}
