import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const { CACHE_PERIOD = 60 } = process.env;

// INFO: Remember to use this middleware only for GET requests
@Injectable()
export class CachingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.set('Cache-Control', `public, max-age=${CACHE_PERIOD}`);
    next();
  }
}
