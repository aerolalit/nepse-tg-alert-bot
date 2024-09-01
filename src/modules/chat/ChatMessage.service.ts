import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatMessageDto } from './dtos/CreateChatMessage.dto';
import { ChatMessage } from './ChatMessage.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  public async create(createChatMessageDto: CreateChatMessageDto): Promise<ChatMessage> {
    const chatMessage = this.chatMessageRepository.create(createChatMessageDto);
    return this.chatMessageRepository.save(chatMessage);
  }

  public async findAll(): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find();
  }

  public async remove(chatId: string, senderId: string, id: string): Promise<void> {
    await this.chatMessageRepository.delete({ chatId, senderId, id });
  }
}
