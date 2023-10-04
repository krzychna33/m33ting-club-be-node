import { FindUserById } from './find-user-by.id';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDbModel } from '../../database/user.db-model';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundException } from '../../user.exceptions';
import { CommandHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindUserById)
export class FindUserByIdQueryHandler {
  constructor(
    @InjectRepository(UserDbModel)
    private userRepository: Repository<UserDbModel>,
  ) {}

  async execute(query: FindUserById): Promise<Result<UserDbModel, Error>> {
    const user = await this.userRepository.findOne({
      where: { id: query.userId },
    });

    if (!user) {
      return Err(new UserNotFoundException());
    }

    return Ok(user);
  }
}
