import { ConfigService } from '@nestjs/config';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const cognitoUserPoolProviderFactory = (config: ConfigService) => {
  return new CognitoUserPool({
    UserPoolId: config.get('COGNITO_USER_POOL_ID'),
    ClientId: config.get('COGNITO_CLIENT_ID'),
  });
};

export const cognitoUserPoolProviderToken = 'COGNITO_USER_POOL';
