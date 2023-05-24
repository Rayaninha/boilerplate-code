import { TelegramProvider } from '../providers/telegramProvider/implementations';
import signale from 'signale';

export default class BaseCommand {
  errors: string[];

  constructor() {
    this.errors = [];
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  addError(message: string): boolean {
    this.errors.push(message);
    return false;
  }

  addErrors(errors: string[]): boolean {
    errors.map((error) => this.errors.push(error));
    return false;
  }

  clear(): Array<string> {
    this.errors = [];
    return this.errors;
  }

  handleException(ex: any): boolean {
    const telegramProvider = new TelegramProvider();

    signale.error(ex.stack);
    this.addError(ex.message);

    telegramProvider.sendErrorsGroupWatch([ex.message]);

    return false;
  }
}
