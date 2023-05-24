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

export const collections = {
  admin: 'admin',
  configurations: 'configurations',
  users: 'users',
  tokens: 'tokens',
  actions: 'actions',
  bots: 'bots',
  schedules: 'schedules',
  games: 'games',
  aviatorEstrelaHistory: 'aviator_estrela_history',
  jetXEstrelaHistory: 'jetx_estrela_history',
  signals: 'signals',
  keys: 'keys',
  rouletteHistories: 'pragmatic_roulette_history',
  links: 'links',
  spacemanEstrelaHistory: 'spaceman_estrela_history',
  jetLucky2EstrelaHistory: 'jetlucky2_estrela_history',
  highStrikerEstrelaHistory: 'high_striker_estrela_history',
  footballStudioHistories: 'football_studio_history',
};

export default MongoDb;
