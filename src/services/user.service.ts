import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../validators/craete-user-dto';
import { UpdateUserDto } from '../validators/update-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async creatingUser(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
  async getUsers() {
    return await this.userRepository.find();
  }
  async getOneUser(id: number) {
    return await this.userRepository.findOne({ where: { id: id } });
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }
  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }
}
