import express from "express"
import { createUser, loginUser, logoutUser, getAllUsers, getUserProfile, updateUserProfile, deleteUserById, updateUserById, getUserById } from "../controllers/userController.js"
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

router
    .route('/')
        .post(createUser)

        // Admin Route
        .get(authenticate, authorizedAdmin, getAllUsers)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router
    .route("/profile")
        .get(authenticate, getUserProfile)
        .put(authenticate, updateUserProfile)

// Admin Routes
router
    .route("/:id")
        .get(authenticate, authorizedAdmin, getUserById)
        .put(authenticate, authorizedAdmin, updateUserById)
        .delete(authenticate, authorizedAdmin, deleteUserById)


export default router