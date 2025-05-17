# Transactions Documentation

Desi Mongoose provides support for ACID transactions in MongoDB, allowing you to perform multiple operations atomically.

## Table of Contents
- [Transaction Basics](#transaction-basics)
- [Session Management](#session-management)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Transaction Basics

### Starting a Transaction

```typescript
import { startSession } from 'desi-mongoose';

const session = await startSession();
session.startTransaction();

try {
  // Perform operations
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Session Management

### Using Sessions with Models

```typescript
const session = await startSession();

try {
  await session.withTransaction(async () => {
    const user = await User.nayaBanao(
      { naam: 'Rahul', balance: 1000 },
      { session }
    );

    const order = await Order.nayaBanao(
      { userId: user._id, amount: 500 },
      { session }
    );
  });
} finally {
  session.endSession();
}
```

## Error Handling

```typescript
async function moneyTransfer(fromAccountId: string, toAccountId: string, amount: number) {
  const session = await startSession();

  try {
    await session.withTransaction(async () => {
      // Deduct from source account
      const fromAccount = await Account.ekBadlo(
        { _id: fromAccountId, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session, new: true }
      );

      if (!fromAccount) {
        throw new Error('Balance kam hai');
      }

      // Add to destination account
      await Account.ekBadlo(
        { _id: toAccountId },
        { $inc: { balance: amount } },
        { session }
      );
    });

    return { success: true, message: 'Paisa transfer ho gaya' };
  } catch (error) {
    return { success: false, message: error.message };
  } finally {
    session.endSession();
  }
}
```

## Examples

### Complete Transaction Example

```typescript
async function createOrderWithInventory(orderData: any, userId: string) {
  const session = await startSession();

  try {
    return await session.withTransaction(async () => {
      // Create order
      const order = await Order.nayaBanao(
        {
          userId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          status: 'Pending'
        },
        { session }
      );

      // Update inventory for each item
      for (const item of orderData.items) {
        const product = await Product.ekBadlo(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }
          },
          { $inc: { stock: -item.quantity } },
          { session, new: true }
        );

        if (!product) {
          throw new Error(`Product ${item.productId} ka stock kam hai`);
        }
      }

      // Update user's order history
      await User.ekBadlo(
        { _id: userId },
        { $push: { orders: order._id } },
        { session }
      );

      // Create payment record
      await Payment.nayaBanao(
        {
          orderId: order._id,
          amount: orderData.totalAmount,
          status: 'Pending'
        },
        { session }
      );

      return order;
    });
  } catch (error) {
    throw new Error(`Order create karne mein error: ${error.message}`);
  } finally {
    session.endSession();
  }
}

// Usage example
try {
  const order = await createOrderWithInventory(
    {
      items: [
        { productId: 'product1', quantity: 2 },
        { productId: 'product2', quantity: 1 }
      ],
      totalAmount: 1500
    },
    'user123'
  );

  console.log('Order successfully created:', order);
} catch (error) {
  console.error('Order creation failed:', error.message);
}
```

This documentation covers transaction support in Desi Mongoose. The examples demonstrate how to use transactions to ensure data consistency across multiple operations with proper error handling and session management.