# CRUD Operations Documentation

Desi Mongoose provides intuitive Hinglish-named methods for performing CRUD (Create, Read, Update, Delete) operations on your MongoDB collections.

## Table of Contents
- [Create Operations](#create-operations)
- [Read Operations](#read-operations)
- [Update Operations](#update-operations)
- [Delete Operations](#delete-operations)
- [Examples](#examples)

## Create Operations

### nayaBanao(data)
Create a new document.
- **Parameters**: `data` - Object containing the document data
- **Returns**: Promise resolving to the created document

```typescript
const user = await User.nayaBanao({
  naam: 'Rahul',
  umar: 25,
  email: 'rahul@example.com'
});
```

### kaiBanao(dataArray)
Create multiple documents.
- **Parameters**: `dataArray` - Array of objects containing document data
- **Returns**: Promise resolving to an array of created documents

```typescript
const users = await User.kaiBanao([
  { naam: 'Priya', umar: 28 },
  { naam: 'Amit', umar: 32 }
]);
```

## Read Operations

### dhoondo(filter)
Find documents matching the filter criteria.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to an array of documents

```typescript
const activeUsers = await User.dhoondo({ isActive: true });
```

### ekDhoondo(filter)
Find a single document matching the filter criteria.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to a single document or null

```typescript
const user = await User.ekDhoondo({ email: 'rahul@example.com' });
```

### ginKeDikhao(filter)
Count documents matching the filter criteria.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to the count number

```typescript
const activeCount = await User.ginKeDikhao({ isActive: true });
```

## Update Operations

### badlo(filter, update)
Update documents matching the filter criteria.
- **Parameters**:
  - `filter` - Query filter object
  - `update` - Update operations object
- **Returns**: Promise resolving to the update result

```typescript
const result = await User.badlo(
  { umar: { $lt: 30 } },
  { $set: { category: 'Young' } }
);
```

### ekBadlo(filter, update)
Update a single document matching the filter criteria.
- **Parameters**:
  - `filter` - Query filter object
  - `update` - Update operations object
- **Returns**: Promise resolving to the updated document

```typescript
const updatedUser = await User.ekBadlo(
  { email: 'rahul@example.com' },
  { $set: { umar: 26 } }
);
```

### dhoondKeBadlo(filter, update)
Find a document and update it in one operation.
- **Parameters**:
  - `filter` - Query filter object
  - `update` - Update operations object
  - `options` - Optional settings
- **Returns**: Promise resolving to the updated document

```typescript
const user = await User.dhoondKeBadlo(
  { _id: userId },
  { $inc: { loginCount: 1 } },
  { new: true }
);
```

## Delete Operations

### hatao(filter)
Delete documents matching the filter criteria.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to the delete result

```typescript
const result = await User.hatao({ isActive: false });
```

### ekHatao(filter)
Delete a single document matching the filter criteria.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to the deleted document

```typescript
const deletedUser = await User.ekHatao({ email: 'rahul@example.com' });
```

### dhoondKeHatao(filter)
Find a document and delete it in one operation.
- **Parameters**: `filter` - Query filter object
- **Returns**: Promise resolving to the deleted document

```typescript
const user = await User.dhoondKeHatao({ _id: userId });
```

## Examples

### Complete CRUD Example

```typescript
// Create a new user
const user = await User.nayaBanao({
  naam: 'Anjali',
  umar: 27,
  email: 'anjali@example.com',
  city: 'Mumbai'
});

// Find users from Mumbai
const mumbaiUsers = await User.dhoondo({ city: 'Mumbai' });

// Update Anjali's age
const updatedUser = await User.ekBadlo(
  { email: 'anjali@example.com' },
  { $set: { umar: 28 } }
);

// Delete inactive users
const deleteResult = await User.hatao({ isActive: false });
```

This documentation covers all the basic CRUD operations available in Desi Mongoose. The Hinglish method names make the API more intuitive and fun to use for developers familiar with Hindi/English mixed vocabulary.