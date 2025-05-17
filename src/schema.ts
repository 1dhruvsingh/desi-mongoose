interface SchemaField {
  type: any;
  required?: boolean;
  default?: any;
  validate?: (value: any) => boolean;
}

interface SchemaDefinition {
  [key: string]: SchemaField;
}

export class DesiSchema {
  private fields: SchemaDefinition;

  constructor(fields: SchemaDefinition) {
    this.fields = fields;
    console.log('📝 Naya schema ban gaya!');
  }

  validate(data: any): boolean {
    for (const [field, config] of Object.entries(this.fields)) {
      if (config.required && !data[field]) {
        throw new Error(`Arre ${field} toh daalo bhai!`);
      }

      if (data[field] && config.validate && !config.validate(data[field])) {
        throw new Error(`${field} mein gadbad hai!`);
      }
    }
    return true;
  }

  static String(options: Partial<SchemaField> = {}) {
    return {
      type: String,
      required: false,
      ...options
    };
  }

  static Number(options: Partial<SchemaField> = {}) {
    return {
      type: Number,
      required: false,
      ...options
    };
  }
}