import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { Lesson, LuckyNumber, Student } from 'vulcan-api-js/lib/models';
import { SchoolService } from './school.service';
import { GradesQueryDto } from './dto/gradesQuery.dto';
import { LessonsQueryDto } from './dto/lessonsQuery.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('grades')
  async getGrades(
    @Query() query: GradesQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.schoolService.init(user);
    return { grades: await this.schoolService.getGrades(query.last) };
  }

  @Get('lessons')
  async getLessons(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<{ lessons: Lesson[] }> {
    await this.schoolService.init(user);
    return this.schoolService.getLessons(query.from, query.to);
  }

  @Get('lucky-number')
  async getLuckyNumber(@GetUser() user: JwtAuthDto): Promise<LuckyNumber> {
    await this.schoolService.init(user);
    return this.schoolService.getLuckyNumber();
  }
  @Get('student')
  async getStudent(@GetUser() user: JwtAuthDto): Promise<Student> {
    await this.schoolService.init(user);
    return this.schoolService.getStudent();
  }
}
