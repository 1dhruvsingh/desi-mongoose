# Events and Middleware Documentation

Desi Mongoose provides a powerful middleware system that allows you to hook into the model lifecycle events using pre and post hooks.

## Table of Contents
- [Available Hooks](#available-hooks)
- [Pre Middleware](#pre-middleware)
- [Post Middleware](#post-middleware)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Available Hooks

Hooks are available for the following operations:
- `save`
- `validate`
- `remove`
- `updateOne`
- `deleteOne`
- `init`

## Pre Middleware

Pre middleware functions are executed before the operation:

```typescript
const userSchema = new DesiSchema({
  naam: String,
  email: String,
  password: String
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Validate email format before saving
userSchema.pre('validate', function(next) {
  if (this.email && !/@/.test(this.email)) {
    next(new Error('Email format sahi nahi hai'));
  }
  next();
});
```

## Post Middleware

Post middleware functions are executed after the operation:

```typescript
const orderSchema = new DesiSchema({
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number
});

// Update inventory after order is saved
orderSchema.post('save', async function(doc) {
  for (const item of doc.items) {
    await Product.ekBadlo(
      { _id: item.product },
      { $inc: { stock: -item.quantity } }
    );
  }
});

// Log when document is removed
orderSchema.post('remove', function(doc) {
  console.log(`Order ${doc._id} ko delete kar diya gaya hai`);
});
```

## Error Handling

```typescript
const productSchema = new DesiSchema({
  naam: String,
  price: Number,
  stock: Number
});

// Validate stock before update
productSchema.pre('updateOne', async function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.stock < 0) {
    next(new Error('Stock negative nahi ho sakta'));
  }
  next();
});

// Handle errors in post middleware
productSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Ye product already exist karta hai'));
  }
  next(error);
});
```

## Examples

### Complete Middleware Example

```typescript
const blogPostSchema = new DesiSchema({
  title: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  publishedAt: Date,
  views: { type: Number, default: 0 }
});

// Pre-save middleware
blogPostSchema.pre('save', function(next) {
  // Set publishedAt when status changes to Published
  if (this.isModified('status') && this.status === 'Published') {
    this.publishedAt = new Date();
  }
  
  // Convert tags to lowercase
  if (this.isModified('tags')) {
    this.tags = this.tags.map(tag => tag.toLowerCase());
  }
  
  next();
});

// Post-save middleware
blogPostSchema.post('save', async function(doc) {
  // Update author's post count
  await User.ekBadlo(
    { _id: doc.author },
    { $inc: { postCount: 1 } }
  );
  
  // Send notification if post is published
  if (doc.status === 'Published') {
    await NotificationService.sendNotification({
      type: 'POST_PUBLISHED',
      userId: doc.author,
      postId: doc._id
    });
  }
});

// Pre-remove middleware
blogPostSchema.pre('remove', async function(next) {
  // Check if post can be deleted
  if (this.status === 'Published') {
    const comments = await Comment.ginKeDikhao({ post: this._id });
    if (comments > 0) {
      next(new Error('Published post with comments ko delete nahi kar sakte'));
    }
  }
  next();
});

// Post-remove middleware
blogPostSchema.post('remove', async function(doc) {
  // Clean up related data
  await Promise.all([
    Comment.hatao({ post: doc._id }),
    User.ekBadlo(
      { _id: doc.author },
      { $inc: { postCount: -1 } }
    )
  ]);
});

// Error handling middleware
blogPostSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error('Post save karne mein error aaya: ' + error.message));
  } else {
    next(error);
  }
});

const BlogPost = new DesiModel('BlogPost', blogPostSchema);
```

This documentation covers the middleware system in Desi Mongoose. The examples demonstrate how to use pre and post hooks to handle various scenarios in your application's data flow with proper error handling.