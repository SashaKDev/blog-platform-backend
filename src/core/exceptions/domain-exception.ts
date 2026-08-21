import { DomainExceptionCodes } from './domain-exception-codes';

export class Extension {
  message: string;
  field: string;
}

export class DomainException extends Error {
  message: string;
  code: DomainExceptionCodes;
  extensions: Extension[];

  constructor(errorInfo: {
    message: string;
    code: number;
    extensions?: Extension[];
  }) {
    super(errorInfo.message);
    this.message = errorInfo.message;
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions || [];
  }
}
