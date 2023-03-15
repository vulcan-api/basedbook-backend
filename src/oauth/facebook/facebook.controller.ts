import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('facebook'))
@Controller('facebook')
export class FacebookController {} // TODO: complete this controller
