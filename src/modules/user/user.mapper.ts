import { Mapper } from '../../libs/ddd/mapper.interface';
import { User } from './User';
import { UserDbModel } from './database/user.db-model';

export class UserMapper
  implements Mapper<User, Omit<UserDbModel, 'meetingMemberships'>>
{
  toDomain(record: UserDbModel): User {
    return new User({
      id: record.id,
      props: {
        email: record.email,
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(entity: User): Omit<UserDbModel, 'meetingMemberships'> {
    return entity.getProps();
  }

  toResponse(entity: User): any {
    return entity.getProps();
  }
}
