import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticate = asyncHandler(async (req, res, next) => {

    let token

    // Read JWT from the "jwt" cookie
    token = req.cookies.jwt

    if (token) {
        try {
            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user Id from token
            const user = await User.findById(decoded.userId).select("-password")
            if (!user) {
                res.status(401);
                throw new Error("User not found")
            }
            req.user = user;
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, please login")
        }
        
    } else {
        res.status(401);
        throw new Error("Not authorized, please login")
    }
});

const authorizedAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as an admin.")
    }
}

const authorizedSeller = (req, res, next) => {
    if (req.user && req.user.isSeller) {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as a seller.")
    }
}

export {
    authenticate,
    authorizedAdmin,
    authorizedSeller,
};