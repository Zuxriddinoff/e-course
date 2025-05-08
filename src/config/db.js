import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("connection db succes");
  } catch (error) {
    console.log("connect db failed");
  }
};
