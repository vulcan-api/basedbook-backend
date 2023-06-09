import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AddUserDto } from './dto/addUser.dto';
import { UpdateConversationDto } from './dto/updateConversation.dto';
import { CreateConversationDto } from './dto/createConversation.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: DbService) {}
  public async getConversationMembers(
    userId: number,
    conversationId: number,
  ): Promise<any> {
    try {
      const data = await this.prisma.conversationUser.findMany({
        where: {
          conversationId: conversationId,
        },
        select: {
          isAdmin: true,
          addedBy: {
            select: {
              username: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      let isMember = false;
      data.map((item: any) => {
        if (item.user.id === userId) {
          isMember = true;
        }
      });
      if (isMember) {
        return data;
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async addConversationMember(
    body: AddUserDto,
    addedBy: number,
  ): Promise<any> {
    try {
      const isInConversation = await this.prisma.conversationUser.findMany({
        where: {
          userId: addedBy,
        },
      });
      if (!isInConversation) {
        return 'You are not in this conversation';
      }
      await this.prisma.conversationUser.create({
        data: {
          userId: body.userId,
          conversationId: body.conversationId,
          addedById: addedBy,
          isAdmin: false,
          isAccepted: false,
          readTime: new Date(),
        },
      });

      return 'User added';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getConversation(
    userId: number,
    conversationId: number,
    skip: number,
    take: number,
  ): Promise<any> {
    try {
      const result = await this.prisma.conversationUser.findMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        select: {
          isAdmin: true,
          conversation: {
            select: {
              id: true,
              avatarId: true,
              name: true,
              messages: {
                skip: skip,
                take: take,
                select: {
                  id: true,
                  content: true,
                  sendTime: true,
                  isEdited: true,
                  sender: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
                orderBy: {
                  sendTime: 'desc',
                },
              },
            },
          },
        },
      });
      result[0].conversation.messages.sort(function (a, b) {
        return a.sendTime.getTime() - b.sendTime.getTime();
      });
      result[0].conversation.messages.map((item: any) => {
        item.isOwned = item.sender.id === userId;
      });
      return {
        ...result[0].conversation,
        isAdmin: result[0].isAdmin,
      };
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getUserConversations(userId: number): Promise<any> {
    try {
      const conversations = await this.prisma.conversationUser.findMany({
        where: {
          userId: userId,
          isAccepted: true,
        },
        select: {
          conversation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      const promises = conversations.map(async (conversation: any) => {
        const { conversation: conversationObj } = conversation;
        conversationObj.numberOfUnreadMessages =
          await this.getNumberOfUnreadMessages(userId, conversationObj.id);
        conversationObj.lastMessage = await this.getLastMessage(
          conversationObj.id,
        );
        return conversationObj;
      });
      return await Promise.all(promises);
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async getLastMessage(conversationId: number): Promise<any> {
    try {
      const result = await this.prisma.message.findMany({
        where: {
          conversationId: conversationId,
        },
        select: {
          id: true,
          content: true,
          sendTime: true,
          sender: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          sendTime: 'desc',
        },
        take: 1,
      });
      return result[0];
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async acceptInvitation(
    conversationId: number,
    userId: number,
  ): Promise<any> {
    try {
      await this.prisma.conversationUser.updateMany({
        where: { conversationId, userId },
        data: { isAccepted: true, acceptedTime: new Date() },
      });
      const conversationUser = await this.prisma.conversationUser.findMany({
        where: { conversationId, userId },
        select: {
          addedBy: {
            select: {
              username: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      if (conversationUser && conversationUser[0].addedBy) {
        await this.sendSystemMessage(
          `${conversationUser[0].addedBy.username} added ${conversationUser[0].user.username} to the conversation`,
          conversationId,
        );
      }
      return 'Invitation accepted';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async declineInvitation(
    conversationId: number,
    userId: number,
  ): Promise<any> {
    try {
      await this.prisma.conversationUser.deleteMany({
        where: { conversationId, userId },
      });
      return 'Invitation declined';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getUserInvitations(userId: number) {
    try {
      return await this.prisma.conversationUser.findMany({
        where: {
          userId: userId,
          isAccepted: false,
        },
        select: {
          addedBy: {
            select: {
              username: true,
            },
          },
          conversation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getNumberOfInvitations(userId: number): Promise<any> {
    try {
      const result = await this.prisma.conversationUser.findMany({
        where: {
          userId: userId,
          isAccepted: false,
        },
      });
      return result.length;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async createConversation(
    createdBy: number,
    body: CreateConversationDto,
  ) {
    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          name: body.name,
          avatarId: body.avatarId,
        },
      });
      await this.prisma.conversationUser.create({
        data: {
          userId: createdBy,
          conversationId: conversation.id,
          isAccepted: true,
          acceptedTime: new Date(),
          addedById: createdBy,
          readTime: new Date(),
          isAdmin: true,
        },
      });
      return conversation;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async removeUserFromConversation(
    userId: number,
    conversationId: number,
    deletedBy: number,
  ): Promise<any> {
    try {
      if (
        userId != deletedBy &&
        !(await this.isAdmin(deletedBy, conversationId))
      ) {
        throw new HttpException('You are not in this conversation', 403);
      }
      await this.prisma.conversationUser.deleteMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
      });
      await this.sendSystemMessage(
        `${await this.getUsername(userId)} was removed from this conversation`,
        conversationId,
      );
      return 'User removed';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async addAdmin(
    userId: number,
    conversationId: number,
    addedBy: number,
  ) {
    if (!(await this.isAdmin(addedBy, conversationId))) {
      throw new HttpException('You are not in this conversation', 403);
    }
    try {
      await this.prisma.conversationUser.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          isAdmin: true,
        },
      });
      await this.sendSystemMessage(
        `${await this.getUsername(
          userId,
        )} is now an admin of this conversation`,
        conversationId,
      );
      return 'Admin added';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async removeAdmin(
    userId: number,
    conversationId: number,
    deletedBy: number,
  ) {
    if (!(await this.isAdmin(deletedBy, conversationId))) {
      throw new HttpException('You are not in this conversation', 403);
    }
    try {
      await this.prisma.conversationUser.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          isAdmin: false,
        },
      });
      await this.sendSystemMessage(
        `${await this.getUsername(deletedBy)} removed ${await this.getUsername(
          userId,
        )} as an admin of this conversation`,
        conversationId,
      );
      return 'Admin removed';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getNumberOfUnreadMessages(
    userId: number,
    conversationId: number,
  ) {
    try {
      const user = await this.prisma.conversationUser.findMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        select: {
          readTime: true,
        },
      });
      if (user.length > 0 && user[0].readTime) {
        try {
          const messages = await this.prisma.message.findMany({
            where: {
              conversationId: conversationId,
              sendTime: {
                gt: user[0].readTime,
              },
            },
          });
          return messages.length;
        } catch (e) {
          console.log(e);
          return 'Error';
        }
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async readMessages(userId: number, conversationId: number) {
    try {
      await this.prisma.conversationUser.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          readTime: new Date(),
        },
      });
      return 'Messages read';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async updateConversation(
    userId: number,
    conversationId: number,
    body: UpdateConversationDto,
  ) {
    try {
      if (!(await this.isAdmin(userId, conversationId))) {
        throw new HttpException(
          'You are not an admin of this conversation',
          403,
        );
      }
      await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          name: body.name,
          avatarId: body.avatarId,
        },
      });
      return 'Conversation updated';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  private async sendSystemMessage(message: string, conversationId: number) {
    return this.prisma.message.create({
      data: {
        content: message,
        senderId: 0,
        conversationId: conversationId,
      },
    });
  }

  public async sendMessage(
    content: string,
    senderId: number,
    conversationId: number,
  ): Promise<any> {
    try {
      if (!(await this.isInConversation(senderId, conversationId))) {
        throw new HttpException('You are not in this conversation', 403);
      }

      return await this.prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          conversationId: conversationId,
        },
      });
    } catch (e) {
      console.log(e);
      throw new Error('Error');
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
  private async getUsername(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });
    if (user) {
      return user.username;
    }
    return 'User not found';
  }
  private async isInConversation(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    const conversationUser = await this.prisma.conversationUser.findMany({
      where: { conversationId: conversationId, userId: userId },
    });
    return conversationUser.length > 0;
  }
  private async isAdmin(userId: number, conversationId: number) {
    const user = await this.prisma.conversationUser.findMany({
      where: {
        userId: userId,
        conversationId: conversationId,
        isAdmin: true,
      },
    });
    return user.length > 0;
  }
}
