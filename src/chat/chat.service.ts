import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: DbService) {}
  public async sendMessage(
    content: string,
    senderId: number,
    receiverId: number,
  ): Promise<string> {
    try {
      await this.prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return 'Message sent';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async getConversation(
    senderId: number,
    receiverId: number,
  ): Promise<any> {
    try {
      return await this.prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: senderId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
        orderBy: {
          sendTime: 'asc',
        },
        select: {
          content: true,
          senderId: true,
          receiverId: true,
          sendTime: true,
        },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async deleteMessage(
    senderId: number,
    messageId: number,
  ): Promise<any> {
    try {
      await this.prisma.message.deleteMany({
        where: { id: messageId, senderId: senderId },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async editMessage(
    senderId: number,
    messageId: number,
    content: string,
  ): Promise<any> {
    try {
      await this.prisma.message.updateMany({
        where: { id: messageId, senderId: senderId },
        data: { content: content, isEdited: true },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
