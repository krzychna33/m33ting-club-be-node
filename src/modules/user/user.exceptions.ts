import { ExceptionBase } from '../../libs/exceptions/exception.base';

export class UserNotFoundException extends ExceptionBase {
  static message = 'User not found';
  constructor(message = UserNotFoundException.message) {
    super(message);
  }

  code = 'USER_NOT_FOUND';
}
