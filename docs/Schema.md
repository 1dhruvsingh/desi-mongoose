# Schema and Model Documentation

Desi Mongoose provides a powerful schema-based solution for modeling your application data using `DesiSchema` and `DesiModel` classes.

## Table of Contents
- [Schema Definition](#schema-definition)
- [Field Types](#field-types)
- [Validation Rules](#validation-rules)
- [Instance Methods](#instance-methods)
- [Static Methods](#static-methods)
- [Model Creation](#model-creation)
- [Examples](#examples)

## Schema Definition

```typescript
import { DesiSchema } from 'desi-mongoose';

const userSchema = new DesiSchema({
  naam: { type: String, required: true },
  umar: { type: Number, min: 0 },
  email: { type: String, unique: true },
  password: { type: String, select: false },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});
```

## Field Types

Supported field types include:
- `String`
- `Number`
- `Date`
- `Boolean`
- `ObjectId`
- `Array`
- `Map`
- `Mixed`
- `Buffer`
- `Decimal128`

## Validation Rules

Built-in validation rules:

```typescript
const productSchema = new DesiSchema({
  naam: {
    type: String,
    required: [true, 'Product naam zaruri hai'],
    minLength: [3, 'Naam kam se kam 3 characters ka hona chahiye'],
    maxLength: [50, 'Naam zyada se zyada 50 characters ka ho sakta hai']
  },
  keemat: {
    type: Number,
    required: true,
    min: [0, 'Keemat negative nahi ho sakti'],
    validate: {
      validator: (value: number) => value % 1 === 0,
      message: 'Keemat mein decimal points nahi ho sakte'
    }
  }
});
```

## Instance Methods

Add custom methods to your schema:

```typescript
userSchema.methods.checkPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function(): string {
  return jwt.sign({ _id: this._id }, 'your-secret-key');
};
```

## Static Methods

Add static methods to your schema:

```typescript
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};
```

## Model Creation

Create a model from your schema:

```typescript
import { DesiModel } from 'desi-mongoose';

const User = new DesiModel('User', userSchema);
```

## Examples

### Basic Schema with Validation

```typescript
const orderSchema = new DesiSchema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    naam: { type: String, required: true },
    pata: { type: String, required: true },
    phone: {
      type: String,
      validate: {
        validator: (v: string) => /\d{10}/.test(v),
        message: 'Phone number valid nahi hai'
      }
    }
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 },
    price: { type: Number, min: 0 }
  }],
  totalAmount: {
    type: Number,
    min: 0,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Add a pre-save hook
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  }
  next();
});

const Order = new DesiModel('Order', orderSchema);
```

This documentation covers the core concepts of schema definition and model creation in Desi Mongoose. The schema system provides a flexible way to define your data structure with built-in type checking, validation, and middleware support.