import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { SchoolService } from './school.service';
import { GradesQueryDto } from './dto/gradesQuery.dto';
import { LessonsQueryDto } from './dto/lessonsQuery.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { VulcanDto } from './dto/vulcanDto';
import { VulcanGuard } from './vulcan.guard';
import { Exam, Homework, Lesson } from 'vulcan-api-js';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(VulcanGuard)
  @Get('grades')
  async getGrades(
    @Query() query: GradesQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.schoolService.getGrades(user.userId, query.last);
  }

  @UseGuards(VulcanGuard)
  @Get('lessons')
  async getLessons(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<Lesson[]> {
    return this.schoolService.getLessons(query.from, query.to, user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('lucky-number')
  async getLuckyNumber(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getLuckyNumber(user.userId);
  }
  @UseGuards(VulcanGuard)
  @Get('student')
  async getStudent(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getStudent(user.userId);
  }
  @UseGuards(VulcanGuard)
  @Get('messages-received')
  async getReceivedMessages(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.schoolService.getMessages(user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('homework')
  async getHomework(@GetUser() user: JwtAuthDto): Promise<Homework[]> {
    return this.schoolService.getHomework(user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('exams')
  async getExams(
    @GetUser() user: JwtAuthDto,
    @Query('last') last: number,
  ): Promise<Exam[]> {
    return this.schoolService.getExams(user.userId, last);
  }

  @UseGuards(VulcanGuard)
  @Get('attendance')
  async getAttendance(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.schoolService.getAttendance(user.userId, query.from, query.to);
  }

  @UseGuards(VulcanGuard)
  @Delete('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVulcanAccount(@GetUser() user: JwtAuthDto): Promise<void> {
    return this.schoolService.deleteVulcanAccount(user.userId);
  }
  @Post('register')
  async register(
    @GetUser() user: JwtAuthDto,
    @Body() data: VulcanDto,
  ): Promise<object> {
    return this.schoolService.register(data, user);
  }
}
