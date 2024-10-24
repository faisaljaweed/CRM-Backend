import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // avatar: {
    //   type: String,
    //   required: true,
    // },

    // coverImage: {
    //   type: String,
    //   // required: true,
    // },

    // watchHistory: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Video',
    // },

    role: {
      type: String,
      enum: ['admin', 'lead', 'employee', 'client'],
      required: true,
    },

    password: {
      type: String,
      required: [true, 'Password is Required'],
    },

    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.EXPIRY_REFRESH_TOKEN,
    }
  );
};
export const User = mongoose.model('User', userSchema);
