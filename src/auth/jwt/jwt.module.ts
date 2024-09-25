import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { configService } from '@kb-config';
import { UsersModule } from '@kb-users';

import { JwtService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    NestJwtModule.register({
      secret: configService.config.JWT_SECRET,
      signOptions: { expiresIn: '24h' }
    }),
    UsersModule
  ],
  providers: [
    JwtStrategy,
    JwtService
  ],
  exports: [
    JwtService
  ]
})
export class JwtModule {}
