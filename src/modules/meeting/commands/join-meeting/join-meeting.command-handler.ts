import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JoinMeetingCommand } from './join-meeting.command';
import { MeetingRepository } from '../../database/meeting.repository';
import { MeetingMember } from '../../domain/MeetingMember';
import { Meeting } from '../../domain/Meeting';
import { Err, Ok, Result } from 'oxide.ts';
import { ExceptionBase } from '../../../../libs/exceptions/exception.base';

@CommandHandler(JoinMeetingCommand)
export class JoinMeetingCommandHandler implements ICommandHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async execute(
    command: JoinMeetingCommand,
  ): Promise<Result<Meeting, unknown>> {
    const meeting = await this.meetingRepository.findOneById(command.meetingId);

    try {
      meeting.join(
        MeetingMember.create({
          userId: command.userId,
          meetingId: meeting.id,
        }),
      );
    } catch (e) {
      return Err(e);
    }

    await this.meetingRepository.update(meeting);

    return Ok(meeting);
  }
}
