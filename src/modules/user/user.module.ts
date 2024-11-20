import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { MongoModule } from 'src/providers/mongo/mongo.module';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  imports: [MongoModule],
})
export class UserModule {}
