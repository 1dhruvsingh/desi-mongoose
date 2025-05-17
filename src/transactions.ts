import { ClientSession } from 'mongodb';
import { desiConnect } from './connection';

export class DesiTransaction {
  private session: ClientSession | null = null;

  async shuru() {
    console.log('🎬 Transaction shuru kar rahe hain...');
    this.session = await (await desiConnect.getConnection()).startSession();
    await this.session?.startTransaction();
    return this.session;
  }

  async pakka() {
    if (!this.session) {
      throw new Error('Transaction shuru nahi hua hai!');
    }
    console.log('✅ Transaction pakka kar rahe hain...');
    await this.session.commitTransaction();
    await this.session.endSession();
    this.session = null;
  }

  async raddKaro() {
    if (!this.session) {
      throw new Error('Transaction shuru nahi hua hai!');
    }
    console.log('❌ Transaction radd kar rahe hain...');
    await this.session.abortTransaction();
    await this.session.endSession();
    this.session = null;
  }

  getSession(): ClientSession | null {
    return this.session;
  }
}

export const desiTransaction = new DesiTransaction();