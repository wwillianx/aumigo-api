import { Module } from '@nestjs/common';
import { Db } from 'mongodb';
import { MongoProvider } from './mongo.provider';

@Module({
  providers: [new MongoProvider()],
  exports: [Db],
})
export class MongoModule {}
