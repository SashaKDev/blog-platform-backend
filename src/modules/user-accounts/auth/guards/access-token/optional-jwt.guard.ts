import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('access-token') {
  // canActivate(context: ExecutionContext) {
  //   return super.canActivate(context);
  // }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    } else {
      return user;
    }
  }
}
