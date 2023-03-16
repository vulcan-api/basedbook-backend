import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthDto } from '../dto/jwt-auth.dto';

@Injectable()
export class ModeratorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: JwtAuthDto = req.user;
    console.log('Role: ', user.role);

    if (user.role === 'MODERATOR') return true;
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'You must be a moderator to perform this action',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
