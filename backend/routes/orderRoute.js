import express from "express"
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, cancelOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userOrder", authMiddleware, userOrders);  // Fixed endpoint name
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/cancel", authMiddleware, cancelOrder);

export default orderRouter;