import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth/register')
export class RegisterController {
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }

  @Post()
  sendJwt(): object {
    return {
      msg: 'to complete',
      JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY3plc2MiOiJpIGNodWogY2kgdyBkdXDEmSBza3Vyd3lzeW51IGN3YW55LCDFvGUgdGXFvMKgdyBvZ8OzbGUgY2kgcHJ6eXN6ZWTFgiBwb215c8WCIG5hIHRvLCBhYnkgcm96a29kb3d5d2HEhyB0ZWdvIGpzb25hLCBhIGNvIGplxZtsaSBieSB0byBiecWCIG3Ds2ogamFracWbIHdhxbxueSBqd3QsIG5wLiBza29waW93YW55IHogbW9qZWdvIGtvbnRhIHByZW1pdW0gbmEgcG9ybmh1YmllPz8gTm8gd8WCYcWbbmllLCBjbyB3IHRha2llaiBzeXR1YWNqaT8iLCJpYXQiOjE1MTYyMzkwMjJ9.z1qpP8iS2AYFlPCNxCSAJa0UzuJMSLU_wsWydW-7SSM',
    };
  }
}
