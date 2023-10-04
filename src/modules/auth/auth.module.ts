import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  cognitoUserPoolProviderFactory,
  cognitoUserPoolProviderToken,
} from './cognito-user-pool.provider';
import { CqrsModule } from '@nestjs/cqrs';
import { SignInCommandHandler } from './commands/sign-in/sign-in.command-handler';
import {
  cognitoIdentityProviderFactory,
  cognitoIdentityProviderToken,
} from './cognito-identity.provider';
import { AuthController } from './auth.controller';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: cognitoUserPoolProviderToken,
      useFactory: cognitoUserPoolProviderFactory,
      inject: [ConfigService],
    },
    {
      provide: cognitoIdentityProviderToken,
      useFactory: cognitoIdentityProviderFactory,
      inject: [ConfigService],
    },
    SignInCommandHandler,
  ],
  controllers: [AuthController],
  exports: [cognitoIdentityProviderToken],
})
export class AuthModule {}
