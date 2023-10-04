import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { Err, match, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { cognitoUserPoolProviderToken } from '../../cognito-user-pool.provider';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { WrongCredentialsException } from '../../auth.exceptions';
import { CreateUserIfNotExistsCommand } from '../../../user/commands/create-user-if-not-exists/create-user-if-not-exists.command';

export interface IUserToken {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler {
  constructor(
    @Inject(cognitoUserPoolProviderToken)
    private readonly cognitoUserPool: CognitoUserPool,
    private readonly commandBus: CommandBus,
  ) {}

  execute({
    email,
    password,
  }: SignInCommand): Promise<
    Result<
      IUserToken | { userConfirmationNecessary: boolean },
      WrongCredentialsException
    >
  > {
    return new Promise((resolve) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: this.cognitoUserPool,
      });

      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (session, userConfirmationNecessary) => {
          if (userConfirmationNecessary) {
            return resolve(Ok({ userConfirmationNecessary }));
          }

          const userCognitoId = session.getIdToken().decodePayload().sub;

          await this.commandBus.execute(
            new CreateUserIfNotExistsCommand({
              email,
              userId: userCognitoId,
            }),
          );

          return resolve(
            Ok({
              accessToken: session.getAccessToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
              idToken: session.getIdToken().getJwtToken(),
            }),
          );
        },
        onFailure: (err) => {
          if (err?.code === 'NotAuthorizedException') {
            return resolve(Err(new WrongCredentialsException()));
          }
          resolve(Err(err));
        },
      });
    });
  }
}
