import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreateMeetingCommand } from './create-meeting.command';
import { Meeting } from '../../domain/Meeting';
import { MeetingRepository } from '../../database/meeting.repository';
import { Err, match, Ok, Result } from 'oxide.ts';
import { FindUserById } from '../../../user/queries/find-user-by-id/find-user-by.id';
import { User } from '../../../user/User';
import { MeetingMember } from '../../domain/MeetingMember';
import { UserDbModel } from '../../../user/database/user.db-model';
import { ExceptionBase } from '../../../../libs/exceptions/exception.base';

@CommandHandler(CreateMeetingCommand)
export class CreateMeetingCommandHandler implements ICommandHandler {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateMeetingCommand): Promise<Result<Meeting, any>> {
    const meeting = Meeting.create({
      title: command.title,
    });

    const userResult: Result<UserDbModel, Error> = await this.queryBus.execute(
      new FindUserById({ userId: command.callerId }),
    );

    match(userResult, {
      Ok: (user: UserDbModel) => {
        meeting.join(
          MeetingMember.create({ userId: user.id, meetingId: meeting.id }),
        );
      },
      Err: (err) => {
        throw err;
      },
    });

    try {
      await this.meetingRepository.insertOne(meeting);
      return Ok(meeting);
    } catch (error) {
      return Err(error);
    }
  }
}
