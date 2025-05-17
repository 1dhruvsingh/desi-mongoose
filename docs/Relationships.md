# Relationships Documentation

Desi Mongoose provides powerful features for managing relationships between different models using references and population.

## Table of Contents
- [Defining Relationships](#defining-relationships)
- [Types of Relationships](#types-of-relationships)
- [Population](#population)
- [Examples](#examples)

## Defining Relationships

You can define relationships between models using the `ref` option in your schema:

```typescript
import { DesiSchema, DesiModel } from 'desi-mongoose';

const authorSchema = new DesiSchema({
  naam: { type: String, required: true },
  email: { type: String, unique: true }
});

const bookSchema = new DesiSchema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  coAuthors: [{ type: Schema.Types.ObjectId, ref: 'Author' }]
});

const Author = new DesiModel('Author', authorSchema);
const Book = new DesiModel('Book', bookSchema);
```

## Types of Relationships

### One-to-One Relationship

```typescript
const userSchema = new DesiSchema({
  naam: String,
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' }
});

const profileSchema = new DesiSchema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  bio: String,
  website: String
});
```

### One-to-Many Relationship

```typescript
const departmentSchema = new DesiSchema({
  naam: String,
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
});

const employeeSchema = new DesiSchema({
  naam: String,
  department: { type: Schema.Types.ObjectId, ref: 'Department' }
});
```

### Many-to-Many Relationship

```typescript
const studentSchema = new DesiSchema({
  naam: String,
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const courseSchema = new DesiSchema({
  naam: String,
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});
```

## Population

### Basic Population

```typescript
// Populate a single reference
const book = await Book.ekDhoondo({ title: 'MongoDB Guide' })
  .populate('author');

// Populate multiple references
const book = await Book.ekDhoondo({ title: 'MongoDB Guide' })
  .populate(['author', 'coAuthors']);
```

### Nested Population

```typescript
const book = await Book.ekDhoondo({ title: 'MongoDB Guide' })
  .populate({
    path: 'author',
    populate: {
      path: 'profile'
    }
  });
```

### Selective Field Population

```typescript
const book = await Book.ekDhoondo({ title: 'MongoDB Guide' })
  .populate('author', 'naam email -_id');
```

## Examples

### Complete Relationship Example

```typescript
// Define schemas with relationships
const orderSchema = new DesiSchema({
  orderNumber: String,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }]
});

const customerSchema = new DesiSchema({
  naam: String,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

const productSchema = new DesiSchema({
  naam: String,
  price: Number
});

// Create models
const Order = new DesiModel('Order', orderSchema);
const Customer = new DesiModel('Customer', customerSchema);
const Product = new DesiModel('Product', productSchema);

// Create and link documents
async function createOrder(customerData, productData, quantity) {
  // Create customer
  const customer = await Customer.nayaBanao(customerData);
  
  // Create product
  const product = await Product.nayaBanao(productData);
  
  // Create order
  const order = await Order.nayaBanao({
    orderNumber: 'ORD-' + Date.now(),
    customer: customer._id,
    items: [{
      product: product._id,
      quantity: quantity
    }]
  });
  
  // Update customer's orders
  await Customer.ekBadlo(
    { _id: customer._id },
    { $push: { orders: order._id } }
  );
  
  // Return populated order
  return await Order.ekDhoondo({ _id: order._id })
    .populate('customer')
    .populate('items.product');
}
```

This documentation covers the relationship features available in Desi Mongoose. The examples demonstrate how to define different types of relationships and use population to fetch related data efficiently.