import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@kb-users';
import { JwtStrategy } from './jwt.strategy';
import { GitHubStrategy } from './github.strategy';
import { configService } from '@kb-config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.config.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
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
  controllers: [AuthController]
})
export class AuthModule {}
