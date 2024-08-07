import express from "express";
import formidable from "express-formidable";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

router.post("/", authenticate, authorizedAdmin, addProduct);

router
  .route("/")
  // .post(authenticate, authorizedAdmin, formidable(), addProduct)
  .get(fetchProducts);

router.route("/allProducts").get(fetchAllProducts);

router.route("/top").get(fetchTopProducts);

router.route("/new").get(fetchNewProducts);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router
  .route("/:id")
  .put(authenticate, authorizedAdmin, updateProduct)
  .delete(authenticate, authorizedAdmin, deleteProduct)
  .get(fetchProductById);

router.route("/filtered-products").post(filterProducts);

export default router;
