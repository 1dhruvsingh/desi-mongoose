import { Collection } from 'mongodb';
import { DesiSchema } from './schema';
import { desiConnect } from './connection';

export class DesiModel {
  private collection: Collection;
  private schema: DesiSchema;

  constructor(name: string, schema: DesiSchema) {
    this.schema = schema;
    this.collection = desiConnect.getDb().collection(name);
  }

  async nayaBanao(data: any) {
    console.log('✨ Naya record bana rahe hain...');
    this.schema.validate(data);
    return await this.collection.insertOne({
      ...data,
      createdAt: new Date()
    });
  }

  async dhundo(query: any = {}) {
    console.log('🔍 Dhund rahe hain...');
    return await this.collection.find(query).toArray();
  }

  async ekDhundo(query: any) {
    console.log('🔍 Ek cheez dhund rahe hain...');
    return await this.collection.findOne(query);
  }

  async badlo(query: any, newData: any) {
    console.log('🔄 Data badal rahe hain...');
    return await this.collection.updateOne(query, {
      $set: { ...newData, updatedAt: new Date() }
    });
  }

  async hatao(query: any) {
    console.log('🗑️ Data hata rahe hain...');
    return await this.collection.deleteOne(query);
  }

  async sabHatao(query: any) {
    console.log('🗑️ Saara data hata rahe hain...');
    return await this.collection.deleteMany(query);
  }

  async kitneHain(query: any = {}) {
    console.log('🔢 Gin rahe hain...');
    return await this.collection.countDocuments(query);
  }
}