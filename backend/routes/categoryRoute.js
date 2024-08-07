import express from "express"
import { createCategory, updateCategory, removeCategory, listCategories, readCategory, fetchProductsByCategory } from "../controllers/categoryController.js"
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

router
    .route('/')
        .post(authenticate, authorizedAdmin, createCategory)

router.route("/:categoryId").put(authenticate, authorizedAdmin, updateCategory);

router
    .route('/:categoryId')
        .delete(authenticate, authorizedAdmin, removeCategory)

router
    .route('/categories')
        .get(listCategories)

router
    .route('/:id')
        .get(readCategory)

router.route('/categories/:categoryId/products').get(fetchProductsByCategory);


export default router