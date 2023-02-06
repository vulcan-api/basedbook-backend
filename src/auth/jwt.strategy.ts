import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

const { SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt,
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  async validate(username: string, password: string): Promise<any> {
    return 'success ' + JSON.stringify({ username, password });
  }
}
