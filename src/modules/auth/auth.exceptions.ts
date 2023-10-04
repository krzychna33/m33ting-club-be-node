import { ExceptionBase } from '../../libs/exceptions/exception.base';

export class WrongCredentialsException extends ExceptionBase {
  static readonly message = 'Wrong credentials';

  constructor(message = WrongCredentialsException.message) {
    super(message);
  }

  code = 'WRONG_CREDENTIALS';
}
