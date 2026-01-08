import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // IMPORTANT
    },

    avatar: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
},

  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);


// password hashing
userSchema.pre("save", async function () {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});



// comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
