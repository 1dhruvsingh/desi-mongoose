# Plugins Documentation

Desi Mongoose supports plugins that allow you to extend schema functionality and reuse common features across multiple schemas.

## Table of Contents
- [Creating Plugins](#creating-plugins)
- [Using Plugins](#using-plugins)
- [Plugin Options](#plugin-options)
- [Examples](#examples)

## Creating Plugins

A plugin is a function that receives the schema as its first parameter and an optional options object as its second parameter:

```typescript
import { DesiSchema } from 'desi-mongoose';

interface TimestampOptions {
  createdAtField?: string;
  updatedAtField?: string;
}

function timestampPlugin(schema: DesiSchema, options: TimestampOptions = {}) {
  const createdAtField = options.createdAtField || 'createdAt';
  const updatedAtField = options.updatedAtField || 'updatedAt';

  schema.add({
    [createdAtField]: Date,
    [updatedAtField]: Date
  });

  schema.pre('save', function(next) {
    if (this.isNew) {
      this[createdAtField] = new Date();
    }
    this[updatedAtField] = new Date();
    next();
  });
}
```

## Using Plugins

Apply plugins to your schema using the `plugin()` method:

```typescript
const userSchema = new DesiSchema({
  naam: String,
  email: String
});

// Apply the timestamp plugin
userSchema.plugin(timestampPlugin, {
  createdAtField: 'banayaGaya',
  updatedAtField: 'badlaGaya'
});
```

## Plugin Options

Plugins can accept options to customize their behavior:

```typescript
interface SoftDeleteOptions {
  deletedField?: string;
  deletedAtField?: string;
}

function softDeletePlugin(schema: DesiSchema, options: SoftDeleteOptions = {}) {
  const deletedField = options.deletedField || 'deleted';
  const deletedAtField = options.deletedAtField || 'deletedAt';

  schema.add({
    [deletedField]: { type: Boolean, default: false },
    [deletedAtField]: Date
  });

  // Add method to soft delete
  schema.methods.softDelete = async function() {
    this[deletedField] = true;
    this[deletedAtField] = new Date();
    return await this.save();
  };

  // Add method to restore
  schema.methods.restore = async function() {
    this[deletedField] = false;
    this[deletedAtField] = null;
    return await this.save();
  };

  // Modify queries to exclude soft deleted documents
  schema.pre(/^find/, function(next) {
    if (!this.getQuery()[deletedField]) {
      this.where({ [deletedField]: false });
    }
    next();
  });
}
```

## Examples

### Pagination Plugin

```typescript
interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

function paginationPlugin(schema: DesiSchema, options: PaginationOptions = {}) {
  const defaultLimit = options.defaultLimit || 10;
  const maxLimit = options.maxLimit || 100;

  schema.statics.paginate = async function(query = {}, options = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(maxLimit, options.limit || defaultLimit);
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.find(query).skip(skip).limit(limit),
      this.countDocuments(query)
    ]);

    return {
      results,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    };
  };
}
```

### Search Plugin

```typescript
interface SearchOptions {
  fields: string[];
}

function searchPlugin(schema: DesiSchema, options: SearchOptions) {
  schema.statics.search = function(query: string) {
    const searchQuery = options.fields.reduce((acc, field) => {
      acc[field] = { $regex: query, $options: 'i' };
      return acc;
    }, {});

    return this.find({ $or: Object.entries(searchQuery).map(([key, value]) => ({ [key]: value })) });
  };
}
```

### Complete Plugin Example

```typescript
// Define the plugin
function auditPlugin(schema: DesiSchema) {
  // Add audit fields
  schema.add({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    auditLog: [{
      action: String,
      field: String,
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      changedAt: { type: Date, default: Date.now }
    }]
  });

  // Add middleware to track changes
  schema.pre('save', function(next) {
    if (this.isNew) {
      this.createdBy = this.$locals.userId;
    }
    this.updatedBy = this.$locals.userId;

    const modifiedPaths = this.modifiedPaths();
    if (modifiedPaths.length > 0) {
      modifiedPaths.forEach(path => {
        if (path !== 'updatedBy' && path !== 'auditLog') {
          this.auditLog.push({
            action: this.isNew ? 'create' : 'update',
            field: path,
            oldValue: this.isNew ? undefined : this.$__getValue(path),
            newValue: this.get(path),
            changedBy: this.$locals.userId
          });
        }
      });
    }

    next();
  });

  // Add method to view audit history
  schema.methods.getAuditHistory = function(options = {}) {
    const query = this.auditLog.find();
    
    if (options.field) {
      query.where('field').equals(options.field);
    }
    if (options.startDate) {
      query.where('changedAt').gte(options.startDate);
    }
    if (options.endDate) {
      query.where('changedAt').lte(options.endDate);
    }

    return query.populate('changedBy', 'naam email');
  };
}

// Use the plugin
const productSchema = new DesiSchema({
  naam: String,
  keemat: Number,
  stock: Number
});

productSchema.plugin(auditPlugin);

const Product = new DesiModel('Product', productSchema);

// Example usage
async function updateProduct(productId: string, updates: any, userId: string) {
  const product = await Product.ekDhoondo({ _id: productId });
  Object.assign(product, updates);
  
  // Set the user ID for audit
  product.$locals.userId = userId;
  
  await product.save();
  
  // Get audit history
  const auditHistory = await product.getAuditHistory({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
  });
  
  return { product, auditHistory };
}
```

This documentation covers the plugin system in Desi Mongoose. The examples demonstrate how to create and use plugins to extend schema functionality with features like timestamps, soft delete, pagination, search, and audit logging.