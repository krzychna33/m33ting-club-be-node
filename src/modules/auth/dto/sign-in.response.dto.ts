import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  idToken: string;

  @Expose()
  refreshToken: string;
}
