
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

  async create(user: User) {
    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.users.map((user) => omit(user, [ 'accessToken', 'refreshToken' ]));
  }

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async updateAccessToken(username: string, accessToken: string) {
    const user = this.users.find((user) => user.username === username);
    if (user) {
      user.accessToken = accessToken;
    }
  }

  async getAccessToken(username: string) {
    const user = this.users.find((user) => user.username === username);
    if (user) {
      return user.accessToken;
    }
  }
}
