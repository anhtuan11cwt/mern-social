import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    latestMessage: {
      sender: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
      text: {
        trim: true,
        type: String,
      },
    },
    users: [
      {
        ref: "User",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

export const Chat = mongoose.model("Chat", chatSchema);
