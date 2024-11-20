import { Collection, Db, ObjectId } from 'mongodb';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  protected readonly collection: Collection<User>;

  constructor(db: Db) {
    this.collection = db.collection('users');
  }

  async createUser(user: User): Promise<ObjectId> {
    try {
      const result = await this.collection.insertOne(user);
      return result.insertedId;
    } catch (error) {
      throw new Error(`Error creating user in the database: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<boolean> {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      return result.matchedCount > 0;
    } catch (error) {
      throw new Error(`Error updating user in the database: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(
        `Error deleting user from the database: ${error.message}`,
      );
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      throw new Error(
        `Error retrieving users from the database: ${error.message}`,
      );
    }
  }
}
