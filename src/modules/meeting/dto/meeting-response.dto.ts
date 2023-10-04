import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class MeetingMembersResponseDto {
  @Expose()
  userId: string;
}

@Exclude()
export class MeetingResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => MeetingMembersResponseDto)
  members: MeetingMembersResponseDto[];
}
