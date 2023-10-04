import { IsString } from 'class-validator';

export class CreateMeetingRequestDto {
  @IsString()
  title: string;
}
