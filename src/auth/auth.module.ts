import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { configService } from '@kb-config';
import { UsersModule } from '@kb-users';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GitHubStrategy } from './github.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.config.JWT_SECRET,
      signOptions: { expiresIn: '24h' }
    }),
    UsersModule
  ],
  providers: [
    // Strategies
    JwtStrategy,
    GitHubStrategy,
    // Services
    AuthService
  ],
  controllers: [ AuthController ]
})
export class AuthModule {}
