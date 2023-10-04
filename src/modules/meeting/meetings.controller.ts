import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMeetingRequestDto } from './dto/create-meeting.request.dto';
import { CreateMeetingCommand } from './commands/create-meeting/create-meeting.command';
import { match, Result } from 'oxide.ts';
import { Meeting } from './domain/Meeting';
import {
  CognitoAccessTokenCheckGuard,
  RequestWithUser,
} from '../../libs/application/auth/cognito-access-token.guard';
import { MeetingMapper } from './meeting.mapper';
import { plainToInstance } from 'class-transformer';
import { MeetingResponseDto } from './dto/meeting-response.dto';
import { JoinMeetingCommandHandler } from './commands/join-meeting/join-meeting.command-handler';
import { JoinMeetingCommand } from './commands/join-meeting/join-meeting.command';
import {
  MeetingIsFull,
  MeetingNotFound,
  UserAlreadyJoined,
  UserIsNotMemberOfMeeting,
} from './domain/meeting.exceptions';
import { LeaveMeetingCommand } from './commands/leave-meeting/leave-meeting.command';
import { GetUserJoinedMeetingsQuery } from './queries/get-user-joined-meetings/get-user-joined-meetings.query';
import { MeetingDbModel } from './database/meeting.db-model';

@UseGuards(CognitoAccessTokenCheckGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly meetingMapper: MeetingMapper,
  ) {}
  @Post()
  async createMeeting(
    @Body() createMeetingDto: CreateMeetingRequestDto,
    @Req() req: RequestWithUser,
  ) {
    const command = new CreateMeetingCommand({
      title: createMeetingDto.title,
      callerId: req.user.id,
    });

    const result: Result<Meeting, unknown> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (meeting: Meeting) => {
        return this.meetingMapper.toResponse(meeting);
      },
      Err: () => {
        throw new BadRequestException();
      },
    });
  }

  @Patch(':meetingId/join')
  async joinMeeting(
    @Req() req: RequestWithUser,
    @Param('meetingId') meetingId: string,
  ) {
    const command = new JoinMeetingCommand({ userId: req.user.id, meetingId });

    const result: Result<Meeting, unknown> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (meeting: Meeting) => {
        return this.meetingMapper.toResponse(meeting);
      },
      Err: (e) => {
        if (e instanceof MeetingIsFull || e instanceof UserAlreadyJoined) {
          throw new BadRequestException(e.message);
        }
        throw new InternalServerErrorException();
      },
    });
  }

  @Patch(':meetingId/leave')
  async leaveMeeting(
    @Req() req: RequestWithUser,
    @Param('meetingId') meetingId: string,
  ) {
    const command = new LeaveMeetingCommand({ userId: req.user.id, meetingId });

    const result: Result<Meeting, unknown> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (meeting: Meeting) => {
        return this.meetingMapper.toResponse(meeting);
      },
      Err: (e) => {
        if (e instanceof UserIsNotMemberOfMeeting) {
          throw new BadRequestException(e.message);
        }
        if (e instanceof MeetingNotFound) {
          throw new NotFoundException(e.message);
        }
        throw new InternalServerErrorException();
      },
    });
  }

  @Get('joined')
  async getJoinedMeetings(@Req() req: RequestWithUser) {
    const meetingsWithMembersResult: Result<MeetingDbModel[], unknown> =
      await this.queryBus.execute(new GetUserJoinedMeetingsQuery(req.user.id));

    return match(meetingsWithMembersResult, {
      Ok: (meetingsWithMembers) => {
        return plainToInstance<MeetingResponseDto, MeetingResponseDto[]>(
          MeetingResponseDto,
          meetingsWithMembers.map((meeting) => {
            return {
              id: meeting.id,
              title: meeting.title,
              createdAt: meeting.createdAt,
              updatedAt: meeting.updatedAt,
              members: meeting.members.map((member) => {
                return {
                  id: member.id,
                  createdAt: member.createdAt,
                  updatedAt: member.updatedAt,
                  userId: member.userId,
                  meetingId: member.meetingId,
                };
              }),
            };
          }),
        );
      },
    });
  }
}
