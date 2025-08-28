


import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
    try {
        let token;

        // ✅ Get token from header or cookie
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        // ❌ If no token, return unauthorized
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        // ✅ Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token"
            });
        }

        // ✅ Use only decoded.id (we stored { id: user._id } at login)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        // ✅ Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Error in isLogin middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in isLogin middleware"
        });
    }
};

export default isLogin;




