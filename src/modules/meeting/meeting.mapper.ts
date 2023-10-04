import { Mapper } from '../../libs/ddd/mapper.interface';
import { Meeting } from './domain/Meeting';
import { MeetingDbModel } from './database/meeting.db-model';
import { Injectable } from '@nestjs/common';
import { MeetingMemberDbModel } from './database/meeting-member.db-model';
import { MeetingMember } from './domain/MeetingMember';
import { plainToInstance } from 'class-transformer';
import { MeetingResponseDto } from './dto/meeting-response.dto';

@Injectable()
export class MeetingMapper
  implements
    Mapper<
      Meeting,
      Omit<MeetingDbModel, 'members'> & {
        members: Omit<MeetingMemberDbModel, 'meeting' | 'user'>[];
      }
    >
{
  toDomain(
    record: MeetingDbModel & { members: MeetingMemberDbModel[] },
  ): Meeting {
    return new Meeting({
      id: record.id,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      props: {
        title: record.title,
        members: record.members.map(
          (member) =>
            new MeetingMember({
              ...member,
              props: { userId: member.userId, meetingId: member.meetingId },
            }),
        ),
      },
    });
  }

  toPersistence(entity: Meeting): Omit<MeetingDbModel, 'members'> & {
    members: Omit<MeetingMemberDbModel, 'meeting' | 'user'>[];
  } {
    const props = entity.getProps();

    const tp = {
      id: entity.id,
      title: props.title,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      members: props.members.map((member) => ({
        meetingId: member.getProps().meetingId,
        id: member.id,
        userId: member.getProps().userId,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
    };

    console.log('tp', tp);

    return tp;
  }

  toResponse(entity: Meeting): any {
    const props = entity.getProps();
    const members = entity.getMembers();
    return plainToInstance<MeetingResponseDto, MeetingResponseDto>(
      MeetingResponseDto,
      {
        id: props.id,
        title: props.title,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        members: members.map((member) => {
          return {
            userId: member.getProps().userId,
          };
        }),
      },
    );
  }
}
