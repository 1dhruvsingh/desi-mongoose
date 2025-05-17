# Caching Documentation

Desi Mongoose provides built-in caching support to improve performance by storing frequently accessed query results.

## Table of Contents
- [Cache Configuration](#cache-configuration)
- [Query Caching](#query-caching)
- [Cache Management](#cache-management)
- [Examples](#examples)

## Cache Configuration

### Basic Configuration

```typescript
import { DesiModel, setCacheConfig } from 'desi-mongoose';

// Configure global cache settings
setCacheConfig({
  enabled: true,
  ttl: 3600, // Cache TTL in seconds
  maxSize: 1000 // Maximum number of cached results
});
```

### Model-Specific Configuration

```typescript
const userSchema = new DesiSchema({
  naam: String,
  email: String
});

const User = new DesiModel('User', userSchema, {
  cache: {
    enabled: true,
    ttl: 1800, // 30 minutes
    maxSize: 500
  }
});
```

## Query Caching

### Basic Query Caching

```typescript
// Cache query results
const users = await User.dhoondo({ isActive: true })
  .cache(true)
  .exec();

// Cache with custom TTL
const products = await Product.dhoondo({ category: 'Electronics' })
  .cache(3600) // Cache for 1 hour
  .exec();
```

### Conditional Caching

```typescript
const getCachedProducts = async (category: string, useCache: boolean) => {
  const query = Product.dhoondo({ category });
  
  if (useCache) {
    query.cache(true);
  }
  
  return await query.exec();
};
```

## Cache Management

### Clearing Cache

```typescript
// Clear all cache
await User.clearCache();

// Clear cache for specific query
await User.dhoondo({ isActive: true })
  .clearCache()
  .exec();

// Clear cache with pattern
await User.clearCache('user:*');
```

### Cache Statistics

```typescript
// Get cache statistics
const stats = await User.getCacheStats();
console.log('Cache Stats:', {
  hits: stats.hits,
  misses: stats.misses,
  size: stats.size
});
```

## Examples

### Complete Caching Example

```typescript
// Configure model with caching
const productSchema = new DesiSchema({
  naam: String,
  keemat: Number,
  category: String,
  rating: Number
});

const Product = new DesiModel('Product', productSchema, {
  cache: {
    enabled: true,
    ttl: 1800,
    maxSize: 1000
  }
});

// Cache management service
class CacheService {
  static async getTopProducts(category: string) {
    const cacheKey = `top_products:${category}`;
    
    return await Product.dhoondo({
      category,
      rating: { $gte: 4 }
    })
    .sort({ rating: -1 })
    .limit(10)
    .cache({
      key: cacheKey,
      ttl: 3600
    })
    .exec();
  }

  static async refreshProductCache(productId: string) {
    // Clear specific product cache
    await Product.clearCache(`product:${productId}`);
    
    // Refetch and cache product
    return await Product.ekDhoondo({ _id: productId })
      .cache(true)
      .exec();
  }

  static async clearCategoryCache(category: string) {
    await Product.clearCache(`*:${category}:*`);
  }

  static async monitorCacheHealth() {
    const stats = await Product.getCacheStats();
    const hitRate = stats.hits / (stats.hits + stats.misses);
    
    console.log('Cache Health:', {
      hitRate: `${(hitRate * 100).toFixed(2)}%`,
      size: stats.size,
      maxSize: stats.maxSize
    });

    // Auto-clear cache if hit rate is too low
    if (hitRate < 0.2) {
      console.log('Cache hit rate bahut kam hai, cache clear kar rahe hain');
      await Product.clearCache();
    }
  }
}

// Usage example
async function productController() {
  try {
    // Get cached top products
    const topProducts = await CacheService.getTopProducts('Electronics');
    console.log('Top Electronics Products:', topProducts);

    // Update product and refresh cache
    await Product.ekBadlo(
      { _id: 'product123' },
      { $set: { rating: 4.5 } }
    );
    await CacheService.refreshProductCache('product123');

    // Clear category cache when adding new product
    await Product.nayaBanao({
      naam: 'New Smartphone',
      category: 'Electronics',
      keemat: 15000,
      rating: 0
    });
    await CacheService.clearCategoryCache('Electronics');

    // Monitor cache health
    await CacheService.monitorCacheHealth();

  } catch (error) {
    console.error('Cache operation mein error:', error);
  }
}
```

This documentation covers the caching features available in Desi Mongoose. The examples demonstrate how to configure and use caching effectively to improve application performance while maintaining data consistency.