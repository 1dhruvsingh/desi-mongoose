# DesiAggregation Documentation

The `DesiAggregation` class provides a fluent interface for building MongoDB aggregation pipelines using Hinglish-named methods. This makes the aggregation operations more intuitive and fun for developers familiar with Hindi/English mixed vocabulary.

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Available Methods](#available-methods)
- [Examples](#examples)

## Installation

The DesiAggregation class is part of the desi-mongoose package. You can import it directly:

```typescript
import { DesiAggregation } from 'desi-mongoose';
```

## Basic Usage

```typescript
const aggregation = new DesiAggregation();

// Build your pipeline
const pipeline = aggregation
  .match({ status: 'active' })
  .milao({
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'userDetails'
  })
  .getPipeline();
```

## Available Methods

### milao(lookupConfig)
Equivalent to MongoDB's `$lookup` stage. Used for performing left outer joins.
- **Parameters**: `lookupConfig` - Configuration object for the lookup operation
- **Returns**: `this` for method chaining

### chuno(fields)
Equivalent to MongoDB's `$project` stage. Used for selecting specific fields.
- **Parameters**: `fields` - Array of field names to include
- **Returns**: `this` for method chaining

### samooh(groupConfig)
Equivalent to MongoDB's `$group` stage. Used for grouping documents.
- **Parameters**: `groupConfig` - Configuration object for the grouping operation
- **Returns**: `this` for method chaining

### khaaliChodo(skipCount)
Equivalent to MongoDB's `$skip` stage. Used for skipping documents.
- **Parameters**: `skipCount` - Number of documents to skip
- **Returns**: `this` for method chaining

### sirafDikhao(limitCount)
Equivalent to MongoDB's `$limit` stage. Used for limiting the number of documents.
- **Parameters**: `limitCount` - Maximum number of documents to return
- **Returns**: `this` for method chaining

### kramBadlo(sortConfig)
Equivalent to MongoDB's `$sort` stage. Used for sorting documents.
- **Parameters**: `sortConfig` - Configuration object for sorting
- **Returns**: `this` for method chaining

### milaKarGino(field)
Custom method that combines `$group` and `$sum` to calculate the total of a field.
- **Parameters**: `field` - Field name to sum
- **Returns**: `this` for method chaining

### unwind(field)
Equivalent to MongoDB's `$unwind` stage. Used for deconstrucing array fields.
- **Parameters**: `field` - Field path to unwind
- **Returns**: `this` for method chaining

### match(condition)
Equivalent to MongoDB's `$match` stage. Used for filtering documents.
- **Parameters**: `condition` - Filter conditions
- **Returns**: `this` for method chaining

### addFields(fields)
Equivalent to MongoDB's `$addFields` stage. Used for adding new fields.
- **Parameters**: `fields` - Fields to add
- **Returns**: `this` for method chaining

### getPipeline()
Returns the constructed aggregation pipeline.
- **Returns**: Array of aggregation stages

## Examples

### Basic Filtering and Sorting
```typescript
const pipeline = new DesiAggregation()
  .match({ status: 'active' })
  .kramBadlo({ createdAt: -1 })
  .sirafDikhao(10)
  .getPipeline();
```

### Lookup with Projection
```typescript
const pipeline = new DesiAggregation()
  .milao({
    from: 'categories',
    localField: 'categoryId',
    foreignField: '_id',
    as: 'category'
  })
  .chuno(['name', 'price', 'category'])
  .getPipeline();
```

### Grouping with Total
```typescript
const pipeline = new DesiAggregation()
  .match({ status: 'completed' })
  .milaKarGino('amount')
  .getPipeline();
```

This documentation provides a comprehensive guide to using the DesiAggregation class for building MongoDB aggregation pipelines with a fun Hinglish twist. The fluent interface makes it easy to chain operations while maintaining readability.