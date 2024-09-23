
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export interface IUser {
  userId: number;
  username: string;
  provider: string;
  accessToken?: string;
};

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
        userId: 10427304,
        username: 'thatkookooguy',
        provider: 'github',
    }
  ];

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }

  async updateAccessToken(username: string, accessToken: string) {
    const user = this.users.find(user => user.username === username);
    if (user) {
        user.accessToken = accessToken;
    }
  }

  async getAccessToken(username: string) {
    const user = this.users.find(user => user.username === username);
    if (user) {
        return user.accessToken;
    }
  }
}