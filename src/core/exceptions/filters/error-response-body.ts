import { Extension } from '../domain-exception';
import { DomainExceptionCodes } from '../domain-exception-codes';

export class ErrorResponseBody {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCodes;
}