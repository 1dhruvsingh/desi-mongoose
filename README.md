# Desi Mongoose Documentation

Welcome to Desi Mongoose - a fun and intuitive MongoDB ODM for Node.js that brings a Hinglish twist to database operations! 🚀

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Features](#core-features)
- [Documentation](#documentation)

## Installation

```bash
npm install desi-mongoose
```

## Quick Start

```typescript
import { DesiModel, DesiSchema } from 'desi-mongoose';

// Define a schema
const userSchema = new DesiSchema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: { type: String, unique: true }
});

// Create a model
const User = new DesiModel('User', userSchema);

// Create a new user
await User.nayaBanao({
  name: 'Raj Kumar',
  age: 25,
  email: 'raj@example.com'
});

// Find users
const users = await User.dhoondo({ umar: { $gt: 18 } });
```

## Core Features

1. **[Schema and Model](./Schema.md)**
   - Schema definition with validation
   - Model creation and operations

2. **[CRUD Operations](./CRUD.md)**
   - Create (nayaBanao)
   - Read (dhoondo, ekDhoondo)
   - Update (badlo)
   - Delete (hatao)

3. **[Aggregations](./Aggregations.md)**
   - Complex data pipeline operations
   - Hinglish-named aggregation methods

4. **[Relationships](./Relationships.md)**
   - Define and manage relationships
   - Population and references

5. **[Validation](./Validation.md)**
   - Built-in validators
   - Custom validation rules

6. **[Events](./Events.md)**
   - Pre and post hooks
   - Middleware functions

7. **[Plugins](./Plugins.md)**
   - Plugin system
   - Extending functionality

8. **[Transactions](./Transactions.md)**
   - ACID transactions
   - Session management

9. **[Caching](./Caching.md)**
   - Query result caching
   - Cache management

## Documentation

Detailed documentation for each feature is available in separate files:

- [Schema and Model Documentation](./Schema.md)
- [CRUD Operations Guide](./CRUD.md)
- [Aggregation Pipeline Guide](./Aggregations.md)
- [Relationships Guide](./Relationships.md)
- [Validation Rules](./Validation.md)
- [Events and Middleware](./Events.md)
- [Plugin System](./Plugins.md)
- [Transaction Management](./Transactions.md)
- [Cache Management](./Caching.md)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT