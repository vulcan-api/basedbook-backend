import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

export interface FacebookUser {
  emails: {
    value: string;
  }[];
  name: {
    familyName: string;
    givenName: string;
  };
  id: string;
  accessToken: string;
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('FB_APP_ID'),
      clientSecret: configService.getOrThrow('FB_APP_SECRET'),
      callbackURL: configService.getOrThrow('FB_CALLBACK_URL'),
      profileFields: ['emails', 'name'],
      scope: ['email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { name, emails, id } = profile;
    const user = {
      emails,
      name,
      id,
      accessToken,
    };
    done(null, user);
  }
}
