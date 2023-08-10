import { Db, MongoClient } from 'mongodb';

import signale from 'signale';

let dbInstance: Db;

class MongoDb {
  async connect(): Promise<any> {
    const mongoClient = await MongoClient.connect(`${process.env.MONGODB_URL}`);

    const database = mongoClient.db(process.env.MONGODB_DATABASE);

    signale.star(`connected to mongodb://${process.env.MONGODB_DATABASE}`);

    return database;
  }

  static async getDb(): Promise<Db> {
    if (dbInstance) {
      return dbInstance;
    }

    const db = await new MongoDb().connect();

    dbInstance = db;

    return db;
  }
}

//collections
export const collections = {
  admin: 'admin',
  configurations: 'configurations',
  users: 'users',
  tokens: 'tokens',
  actions: 'actions',
  pets: 'pets',
};

export default MongoDb;
