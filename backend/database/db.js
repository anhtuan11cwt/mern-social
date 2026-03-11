import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Đã kết nối đến MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };
