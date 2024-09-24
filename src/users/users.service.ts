
import { omit } from 'lodash';
import { MongoRepository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@kb-models';

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

  create(user: User) {
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.users.map((user) => omit(user, [ 'accessToken', 'refreshToken' ]));
  }

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
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
