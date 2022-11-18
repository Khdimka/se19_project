import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 24 },
    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 90,
      unique: true,
    },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  });

const User = mongoose.model("User", userSchema);

export default User;