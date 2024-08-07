import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  markOrderAsOutForDelivery,
  applyCouponDiscount,
  markOrderAsPay,
} from "../controllers/orderController.js";

import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizedAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, authorizedAdmin, markOrderAsPay);

router.route("/:id/paid").put(authenticate, markOrderAsPaid);

router
  .route("/:id/deliver")
    .put(authenticate, authorizedAdmin, markOrderAsDelivered)

router
  .route("/:id/out-for-delivery")
    .put(authenticate, authorizedAdmin, markOrderAsOutForDelivery);

router.route("/apply-coupon/:couponCode").get(authenticate, applyCouponDiscount);


export default router;
