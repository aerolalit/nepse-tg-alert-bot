import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User.entity';
import { UserService } from './User.service';
import { ChatService } from './Chat.service';
import { Chat } from './Chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  providers: [UserService, ChatService],
  exports: [UserService, ChatService],
})
export class UserModule {}
