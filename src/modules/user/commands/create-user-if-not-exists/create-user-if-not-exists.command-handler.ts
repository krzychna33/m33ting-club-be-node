import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserIfNotExistsCommand } from './create-user-if-not-exists.command';
import { User } from '../../User';
import { UserRepository } from '../../database/user.repository';
import { Ok, Result } from 'oxide.ts';

@CommandHandler(CreateUserIfNotExistsCommand)
export class CreateUserIfNotExistsCommandHandler implements ICommandHandler {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(
    command: CreateUserIfNotExistsCommand,
  ): Promise<Result<User | undefined, Error>> {
    const user = await this.userRepository.findByEmail(command.email);

    if (user) {
      return Ok(undefined);
    }

    const newUser = User.create(
      {
        email: command.email,
      },
      command.userId,
    );
    await this.userRepository.insertOne(newUser);

    return Ok(newUser);
  }
}
