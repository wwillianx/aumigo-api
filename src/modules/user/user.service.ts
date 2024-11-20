import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto, User } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: User) {
    try {
      return await this.userRepository.createUser(user);
    } catch (error) {
      throw new HttpException(`Unable to create user: ${error.message}`, 500);
    }
  }

  async getUserById(id: string): Promise<User> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const updated = await this.userRepository.updateUser(id, updateData);
      if (!updated) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new HttpException(
        `Unable to update user: ${error.message}`,
        error.status,
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const deleted = await this.userRepository.deleteUser(id);
      if (!deleted) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new HttpException(
        `Unable to delete user: ${error.message}`,
        error.status,
      );
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAllUsers();
    } catch (error) {
      throw new HttpException(
        `Unable to retrieve users: ${error.message}`,
        500,
      );
    }
  }
}
