import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtAuthDto } from '../dto/jwt-auth.dto';

const { SECRET = 'secret' } = process.env;

const extractFromCookie = (req: any): string | null => {
  /* if it is a WebSocket request  */
  if (req.hasOwnProperty('handshake')) {
    console.log(`\n\n A WebSocket Request:`);
    return req.handshake.headers.cookie
      .split('; ')
      .find((cookie: string) => cookie.startsWith('jwt'))
      .split('=')[1];
  }
  console.log(`\n\nRequest path: "${req.path}"`, req.cookies);
  if (req && req.cookies) return req.cookies['jwt'];
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: extractFromCookie,
      secretOrKey: SECRET,
    });
  }

  async validate(jwtAuthDto: JwtAuthDto): Promise<any> {
    if (jwtAuthDto.isBanned) throw new Error('User is banned');
    console.log('validation successful, jwtAuthDto: ', jwtAuthDto);
    return jwtAuthDto;
  }
}
