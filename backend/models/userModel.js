import mongoose from 'mongoose';
import becrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encyrpt password before save to db
userSchema.pre('save', async function (next) {
  // Prevent password from being created again
  if (!this.isModified('password')) {
    next();
  }

  const salt = await becrypt.genSalt(10);
  this.password = await becrypt.hash(this.password, salt);
});

// Comparing the entereted password with the encrypted password. Return true if match.
// Can be moved into the user controller too
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await becrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
