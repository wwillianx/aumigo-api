import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UpdateUserDto, User, UserType } from './user.entity';
import { ObjectId } from 'mongodb';

async function createTestingModule() {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: UserRepository,
        useValue: {
          createUser: jest.fn(),
          getUserById: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: jest.fn(),
          findAllUsers: jest.fn(),
        },
      },
    ],
  }).compile();

  return {
    userService: module.get<UserService>(UserService),
    userRepository: module.get<UserRepository>(UserRepository),
  };
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    ({ userService, userRepository } = await createTestingModule());
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should call createUser and return the created user', async () => {
      const mockUser = {
        name: 'test',
        email: 'test@email.com',
        password: '1234',
        cpf: '12345678901',
        userType: UserType.Tutor,
      };
      const mockCreateUserReturn = new ObjectId('672e5a38dd7092b734c6719f');
      jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValue(mockCreateUserReturn);

      const result = await userService.createUser(mockUser);
      expect(userRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockCreateUserReturn);
    });

    it('should throw HttpException if user creation fails', async () => {
      const mockUser: User = {
        name: 'Test User',
        email: 'test@example.com',
      } as User;
      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValue(new Error('Creation error'));

      await expect(userService.createUser(mockUser)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getUserById', () => {
    it('should call getUserById and return the user if found', async () => {
      const userId = new ObjectId().toString();
      const mockUser: User = {
        name: 'Test User',
        email: 'test@example.com',
      } as User;
      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if ID format is invalid', async () => {
      const invalidId = '12345';
      await expect(userService.getUserById(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw HttpException if user not found', async () => {
      const userId = new ObjectId().toString();
      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if getUserById encounters an error', async () => {
      const userId = new ObjectId().toString();
      jest
        .spyOn(userRepository, 'getUserById')
        .mockRejectedValue(new Error('Error fetching user'));

      await expect(userService.getUserById(userId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateUser', () => {
    it('should call updateUser and not throw if update is successful', async () => {
      const userId = new ObjectId().toString();
      const updateData: UpdateUserDto = { name: 'Updated User' };
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(true);

      await userService.updateUser(userId, updateData);
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        userId,
        updateData,
      );
    });

    it('should throw BadRequestException if ID format is invalid', async () => {
      const invalidId = '12345';
      const updateData: UpdateUserDto = { name: 'Updated User' };
      await expect(
        userService.updateUser(invalidId, updateData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw HttpException if user not found', async () => {
      const userId = new ObjectId().toString();
      const updateData: UpdateUserDto = { name: 'Updated User' };
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(false);

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if updateUser encounters an error', async () => {
      const userId = new ObjectId().toString();
      const updateData: UpdateUserDto = { name: 'Updated User' };
      jest
        .spyOn(userRepository, 'updateUser')
        .mockRejectedValue(new Error('Update error'));

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser and not throw if deletion is successful', async () => {
      const userId = new ObjectId().toString();
      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(true);

      await userService.deleteUser(userId);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException if ID format is invalid', async () => {
      const invalidId = '12345';
      await expect(userService.deleteUser(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw HttpException if user not found', async () => {
      const userId = new ObjectId().toString();
      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(false);

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if deleteUser encounters an error', async () => {
      const userId = new ObjectId().toString();
      jest
        .spyOn(userRepository, 'deleteUser')
        .mockRejectedValue(new Error('Deletion error'));

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAllUsers', () => {
    it('should call findAllUsers and return a list of users', async () => {
      const mockUsers: User[] = [
        { name: 'User1', email: 'user1@example.com' },
      ] as User[];
      jest.spyOn(userRepository, 'findAllUsers').mockResolvedValue(mockUsers);

      const result = await userService.findAllUsers();
      expect(userRepository.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw HttpException if findAllUsers encounters an error', async () => {
      jest
        .spyOn(userRepository, 'findAllUsers')
        .mockRejectedValue(new Error('Retrieval error'));

      await expect(userService.findAllUsers()).rejects.toThrow(HttpException);
    });
  });
});
