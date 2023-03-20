import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  surname: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: GoogleUser, info?: any) => void,
  ): Promise<void> {
    const user = {
      id: profile.id,
      email: profile.emails ? profile.emails[0].value : '',
      name: profile.name ? profile.name.givenName : '',
      surname: profile.name ? profile.name.familyName : '',
    };
    done(null, user);
  }
}
