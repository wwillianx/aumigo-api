import {
  FactoryProvider,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoProvider implements FactoryProvider<Db> {
  public provide = Db;

  public async useFactory(): Promise<Db> {
    new Logger(MongoProvider.name).warn('Connecting to MongoDB.');

    try {
      const client = await MongoClient.connect(process.env.MONGO_DB_URL);
      return client.db(process.env.MONGO_DB_NAME);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to connect to MongoDB: ${error}`,
      );
    }
  }
}
