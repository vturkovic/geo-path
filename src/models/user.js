const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("./order");
const Company = require("./company");
const Role = require("./role");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // validate(value) {
      //   if (value.toLowerCase().includes("password")) {
      //     throw new Error('Password cannot contain "password"');
      //   }
      // },
    },
    repeatPassword: {
      type: String,
      required: true,
      trim: true,
      // validate(value) {
      //   if (value.toLowerCase().includes("password")) {
      //     throw new Error('Password cannot contain "password"');
      //   }
      // },
    },
    confirmed:{
      type: Boolean,
      default: false
    },
    address:{
      type: String
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    firstLogin:{
      type: String,
      default: ""
    },
    worksFor: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

//Roles Foreign key
userSchema.virtual("roles", {
  ref: "Role",
  localField: "_id",
  foreignField: "owner",
});

//Orders Foreign key
userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "owner",
});

//Companys Foreign key
userSchema.virtual("companys", {
  ref: "Company",
  localField: "_id",
  foreignField: "owner",
});

//JSON object response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//Generate auth token on register
userSchema.methods.generateAuthTokenRegistration = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {expiresIn: 600});

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Generate auth token on login
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Check if email and password match
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user role when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Role.deleteMany({ owner: user._id });
  next();
});

// Delete user orders when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Order.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
