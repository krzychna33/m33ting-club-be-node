import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignInRequestDto } from './dto/sign-in.request.dto';
import { SignInCommand } from './commands/sign-in/sign-in.command';
import { match } from 'oxide.ts';
import { plainToInstance } from 'class-transformer';
import { SignInResponseDto } from './dto/sign-in.response.dto';
import { WrongCredentialsException } from './auth.exceptions';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-in')
  async signIn(@Body() dto: SignInRequestDto) {
    const command = new SignInCommand(dto);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (userTokens) => {
        return plainToInstance(SignInResponseDto, userTokens);
      },
      Err: (e) => {
        if (e instanceof WrongCredentialsException) {
          throw new BadRequestException(e.message);
        }

        throw e;
      },
    });
  }
}
