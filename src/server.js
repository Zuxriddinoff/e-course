import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import {
  superAdminRouter,
  adminRouter,
  userRouter,
  categoryRouter,
  CourseRouter,
  EnrollmentRouter,
  rewievRouter,
  authorRouter,
} from "./router/index.js";
import cookieParser from "cookie-parser";
import logger from "./utils/logger/logger.js";
config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = +process.env.PORT || 5555;

app.use("/superadmin", superAdminRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/course", CourseRouter);
app.use("/enrollment", EnrollmentRouter);
app.use("/rewiev", rewievRouter);
app.use("/author", authorRouter);

await connectDB();

process.on("uncaughtException", (err) => {
  if (err) console.log(`Uncaught exception: ${err}`);
  process.exit(1);
});

process.on("unhandledRejection", (reasion, promise) => {
  console.log(`Unhandled rejection: ${reasion}`);
});

app.use((err, req, res, next) => {
  if (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  } else {
    return next();
  }
});

app.listen(PORT, logger.info(`Server running on port ${PORT}`));
