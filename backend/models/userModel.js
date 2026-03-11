import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    followers: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    following: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    gender: {
      enum: ["male", "female"],
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    profilePic: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
