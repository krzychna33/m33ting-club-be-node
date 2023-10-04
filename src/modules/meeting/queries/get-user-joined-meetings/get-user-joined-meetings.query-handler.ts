import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MeetingDbModel } from '../../database/meeting.db-model';
import { GetUserJoinedMeetingsQuery } from './get-user-joined-meetings.query';
import { Ok, Result } from 'oxide.ts';

@QueryHandler(GetUserJoinedMeetingsQuery)
export class GetUserJoinedMeetingsQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(MeetingDbModel)
    private readonly meetingsRepository: Repository<MeetingDbModel>,
  ) {}

  async execute(
    query: GetUserJoinedMeetingsQuery,
  ): Promise<Result<MeetingDbModel[], unknown>> {
    const meetingWhereUserJoined = await this.meetingsRepository.find({
      where: { members: { userId: query.userId } },
    });

    const meetingsWithMembers = await this.meetingsRepository.find({
      where: { id: In(meetingWhereUserJoined.map((meeting) => meeting.id)) },
      relations: ['members'],
    });

    return Ok(meetingsWithMembers);
  }
}
