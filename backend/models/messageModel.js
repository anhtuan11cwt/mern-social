import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      ref: "Chat",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    sender: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    text: {
      required: true,
      trim: true,
      type: String,
    },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
