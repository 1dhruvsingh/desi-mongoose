# Validation Documentation

Desi Mongoose provides comprehensive validation features to ensure data integrity using both built-in and custom validators.

## Table of Contents
- [Built-in Validators](#built-in-validators)
- [Custom Validators](#custom-validators)
- [Async Validation](#async-validation)
- [Error Messages](#error-messages)
- [Examples](#examples)

## Built-in Validators

### Common Validators

```typescript
const productSchema = new DesiSchema({
  naam: {
    type: String,
    required: [true, 'Naam dena zaruri hai'],
    trim: true,
    minLength: [2, 'Naam bahut chota hai'],
    maxLength: [50, 'Naam bahut bada hai']
  },
  keemat: {
    type: Number,
    required: true,
    min: [0, 'Keemat negative nahi ho sakti'],
    max: [1000000, 'Keemat bahut zyada hai']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email format sahi nahi hai']
  },
  category: {
    type: String,
    enum: {
      values: ['Electronics', 'Clothing', 'Books'],
      message: '{VALUE} valid category nahi hai'
    }
  }
});
```

## Custom Validators

### Simple Custom Validator

```typescript
const userSchema = new DesiSchema({
  password: {
    type: String,
    validate: {
      validator: function(value: string) {
        return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value);
      },
      message: 'Password mein minimum 8 characters, ek capital letter aur ek number hona chahiye'
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} valid phone number nahi hai!`
    }
  }
});
```

### Multiple Validators

```typescript
const productSchema = new DesiSchema({
  discount: {
    type: Number,
    validate: [
      {
        validator: function(v: number) {
          return v >= 0;
        },
        message: 'Discount negative nahi ho sakta'
      },
      {
        validator: function(v: number) {
          return v <= this.keemat;
        },
        message: 'Discount keemat se zyada nahi ho sakta'
      }
    ]
  }
});
```

## Async Validation

```typescript
const userSchema = new DesiSchema({
  email: {
    type: String,
    validate: {
      validator: async function(email: string) {
        const user = await User.ekDhoondo({ email });
        return !user; // Returns false if user exists
      },
      message: 'Email already registered hai'
    }
  }
});
```

## Error Messages

### Custom Error Messages

```typescript
const orderSchema = new DesiSchema({
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: {
        type: Number,
        required: [true, 'Quantity batana zaruri hai'],
        min: [1, 'Quantity kam se kam 1 honi chahiye'],
        validate: {
          validator: Number.isInteger,
          message: 'Quantity mein decimal points nahi ho sakte'
        }
      }
    }],
    validate: [
      {
        validator: function(v: any[]) {
          return v.length > 0;
        },
        message: 'Order mein kam se kam ek item hona chahiye'
      }
    ]
  }
});
```

## Examples

### Complete Validation Example

```typescript
const employeeSchema = new DesiSchema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID zaruri hai'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^EMP\d{4}$/.test(v);
      },
      message: 'Employee ID format sahi nahi hai (e.g., EMP1234)'
    }
  },
  naam: {
    type: String,
    required: [true, 'Naam zaruri hai'],
    trim: true,
    minLength: [2, 'Naam bahut chota hai'],
    maxLength: [50, 'Naam bahut bada hai']
  },
  email: {
    type: String,
    required: [true, 'Email zaruri hai'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Email format sahi nahi hai'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number zaruri hai'],
    validate: {
      validator: function(v: string) {
        return /\d{10}/.test(v);
      },
      message: 'Phone number 10 digits ka hona chahiye'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Salary zaruri hai'],
    min: [0, 'Salary negative nahi ho sakti'],
    validate: {
      validator: function(v: number) {
        return v % 100 === 0;
      },
      message: 'Salary 100 ke multiple mein honi chahiye'
    }
  },
  department: {
    type: String,
    required: [true, 'Department zaruri hai'],
    enum: {
      values: ['IT', 'HR', 'Finance', 'Marketing'],
      message: '{VALUE} valid department nahi hai'
    }
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date zaruri hai'],
    validate: {
      validator: function(v: Date) {
        return v <= new Date();
      },
      message: 'Joining date future mein nahi ho sakti'
    }
  }
});

// Add a pre-save hook for additional validation
employeeSchema.pre('save', function(next) {
  if (this.isModified('salary') && this.salary > 1000000) {
    const err = new Error('Salary 10 lakh se zyada nahi ho sakti');
    next(err);
  } else {
    next();
  }
});

const Employee = new DesiModel('Employee', employeeSchema);
```

This documentation covers the validation features available in Desi Mongoose. The examples demonstrate how to use both built-in and custom validators to ensure data integrity with meaningful Hinglish error messages.