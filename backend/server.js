import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cardRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectDB();

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cardRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("Api Working");
});

app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`);
});