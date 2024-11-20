import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsNumberString,
  Length,
  IsEnum,
} from 'class-validator';

export enum UserType {
  PetWalker = 'PetWalker',
  Tutor = 'Tutor',
}

export class User {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'email must not be empty' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'securepassword',
    minLength: 4,
  })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsNotEmpty({ message: 'password must not be empty' })
  password: string;

  @ApiProperty({
    description: 'CPF number of the user, containing only numbers',
    example: '12345678901',
  })
  @IsNumberString({}, { message: 'CPF number must contain only numbers' })
  @Length(11, 11, { message: 'CPF number must be exactly 11 digits' })
  @IsNotEmpty({ message: 'cpf must not be empty' })
  cpf: string;

  @ApiProperty({
    description: 'User type, which can be either PetWalker or Tutor',
    enum: UserType,
    example: UserType.PetWalker,
  })
  @IsEnum(UserType, { message: 'User type must be either PetWalker or Tutor' })
  @IsNotEmpty({ message: 'userType must not be empty' })
  userType: UserType;
}

export class UpdateUserDto extends PartialType(
  PickType(User, ['name', 'cpf', 'email']),
) {}
