import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.entity';
import { CreateUserDto } from './dtos/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  public async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
