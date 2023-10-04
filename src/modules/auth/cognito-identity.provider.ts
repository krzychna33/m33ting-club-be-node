import { ConfigService } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const cognitoIdentityProviderFactory = (config: ConfigService) => {
  return new CognitoIdentityServiceProvider({
    region: config.get('AWS_REGION'),
  });
};

export const cognitoIdentityProviderToken = 'COGNITO_IDENTITY_PROVIDER';
