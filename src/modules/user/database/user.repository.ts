import { RepositoryBase } from '../../../libs/db/repository.base';
import { User } from '../User';
import { UserDbModel } from './user.db-model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapper } from '../user.mapper';

export class UserRepository extends RepositoryBase<
  User,
  Omit<UserDbModel, 'meetingMemberships'>
> {
  constructor(
    @InjectRepository(UserDbModel)
    protected repository: Repository<UserDbModel>,
    protected readonly mapper: UserMapper,
  ) {
    super(repository, mapper);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.repository.findOne({ where: { email } });

    return userModel ? this.mapper.toDomain(userModel) : null;
  }
}
