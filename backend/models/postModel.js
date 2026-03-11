import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      trim: true,
      type: String,
    },
    comments: [
      {
        comment: {
          required: true,
          type: String,
        },
        createdAt: {
          default: Date.now,
          type: Date,
        },
        name: {
          required: true,
          type: String,
        },
        user: {
          ref: "User",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    likes: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    owner: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    post: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    type: {
      default: "post",
      enum: ["post", "reel"],
      required: true,
      type: String,
    },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
