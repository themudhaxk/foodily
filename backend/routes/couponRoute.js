import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateSingleCoupon,
  deleteSingleCoupon,
} from "../controllers/couponController.js";
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticate, authorizedAdmin, createCoupon).get(authenticate, authorizedAdmin, getAllCoupons);
router
  .route("/:id")
  .get(authenticate, authorizedAdmin, getSingleCoupon)
  .patch(authenticate, authorizedAdmin, updateSingleCoupon)
  .delete(authenticate, authorizedAdmin, deleteSingleCoupon);

export default router;
