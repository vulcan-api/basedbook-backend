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
    return { grades: await this.schoolService.getGrades(query.last, user) };
  }

  @Get('lessons')
  async getLessons(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<{ lessons: Lesson[] }> {
    return this.schoolService.getLessons(query.from, query.to, user);
  }

  @Get('lucky-number')
  async getLuckyNumber(@GetUser() user: JwtAuthDto): Promise<LuckyNumber> {
    return this.schoolService.getLuckyNumber(user);
  }
  @Get('student')
  async getStudent(@GetUser() user: JwtAuthDto): Promise<Student> {
    return this.schoolService.getStudent(user);
  }
}
