import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { SchoolService } from './school.service';
import { GradesQueryDto } from './dto/gradesQuery.dto';
import { LessonsQueryDto } from './dto/lessonsQuery.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { VulcanDto } from './dto/vulcanDto';
import { VulcanGuard } from './vulcan.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(VulcanGuard)
  @Get('grades')
  async getGrades(
    @Query() query: GradesQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return { grades: await this.schoolService.getGrades(query.last, user) };
  }

  @UseGuards(VulcanGuard)
  @Get('lessons')
  async getLessons(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<{ lessons: object[] }> {
    return this.schoolService.getLessons(query.from, query.to, user);
  }

  @UseGuards(VulcanGuard)
  @Get('lucky-number')
  async getLuckyNumber(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getLuckyNumber(user);
  }
  @UseGuards(VulcanGuard)
  @Get('student')
  async getStudent(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getStudent(user);
  }
  @UseGuards(VulcanGuard)
  @Get('messages-received')
  async getReceivedMessages(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getMessages(user);
  }

  @Post('register')
  async register(
    @GetUser() user: JwtAuthDto,
    @Body() data: VulcanDto,
  ): Promise<object> {
    return this.schoolService.register(data, user);
  }
}
