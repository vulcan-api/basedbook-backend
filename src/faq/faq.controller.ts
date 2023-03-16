import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FaqService } from './faq.service';
import { AddFaqDto } from './dto/addFaq.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { ModeratorGuard } from '../auth/guards/moderator.guard';
import { AnswerDto } from './dto/answer.dto';
import { ChangeQuestionDto } from './dto/changeQuestion.dto';
import { HierarchyDto } from './dto/hierarchy.dto';
import { async } from 'rxjs';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  getAnsweredFaq() {
    return this.faqService.getAnsweredQuestions();
  }

  @Get('unanswered')
  getUnansweredFaq() {
    return this.faqService.getUnansweredQuestions();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ask')
  async askQuestion(@Body() dto: AddFaqDto, @GetUser() user: JwtAuthDto) {
    await this.faqService.askQuestion(dto.question, user.userId);
    return { statusCode: 201, message: 'Question added' };
  }

  @UseGuards(AuthGuard('jwt'), ModeratorGuard)
  @Post('answer')
  async answer(@Body() dto: AnswerDto) {
    await this.faqService.answerQuestion(dto.questionId, dto.answer);
    return { statusCode: 201, message: 'Question answered' };
  }

  @UseGuards(AuthGuard('jwt'), ModeratorGuard)
  @Post('changeQuestion')
  async changeQuestion(@Body() dto: ChangeQuestionDto) {
    await this.faqService.changeQuestion(dto.questionId, dto.question);
    return { statusCode: 201, message: 'Question changed' };
  }

  @UseGuards(AuthGuard('jwt'), ModeratorGuard)
  @Post('changeHierarchy')
  async changeHierarchy(@Body() dto: HierarchyDto) {
    await this.faqService.changeHierarchy(dto.questionId, dto.hierarchy);
    return { statusCode: 201, message: 'Hierarchy changed' };
  }

  @UseGuards(AuthGuard('jwt'), ModeratorGuard)
  @Delete()
  async deleteQuestion(@Body('questionId') questionId: number) {
    if (!questionId) throw new HttpException('Question id not provided', 400);
    await this.faqService.deleteQuestion(questionId);
    return { statusCode: 201, message: 'Question deleted' };
  }
}
