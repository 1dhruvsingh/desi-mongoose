export class DesiRelation {
  static ref(modelName: string, options: any = {}) {
    return {
      type: 'ObjectId',
      ref: modelName,
      ...options
    };
  }

  static array(modelName: string) {
    return {
      type: ['ObjectId'],
      ref: modelName
    };
  }
}