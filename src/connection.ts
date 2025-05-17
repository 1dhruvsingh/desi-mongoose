import { MongoClient, Db } from 'mongodb';

class DesiConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(url: string = 'mongodb://localhost:27017', dbName: string = 'test') {
    try {
      console.log('🙏 Namaste MongoDB!');
      this.client = await MongoClient.connect(url);
      this.db = this.client.db(dbName);
      console.log('✨ Connection ho gaya!');
      return this.db;
    } catch (error) {
      console.error('😢 Arre baap re! Connection nahi hua:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('👋 Alvida, MongoDB!');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database connection nahi hai!');
    }
    return this.db;
  }

  getConnection(): MongoClient {
    if (!this.client) {
      throw new Error('MongoDB connection nahi hai!');
    }
    return this.client;
  }
}

export const desiConnect = new DesiConnection();