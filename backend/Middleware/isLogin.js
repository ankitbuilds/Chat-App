import jwt from 'jsonwebtoken'
import User from '../Models/userModels.js'

const isLogin = (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) return res.status(500).send({ success: false, message: "User Unauthorize" });
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(500).send({ success: false, message: "User Unauthorize -Invalid Token" })
        const user = User.findById(decode.userId).select("-password");
        if (!user) return res.status(500).send({ success: false, message: "User not found" })
        req.user = user,
            next()
    } catch (error) {
        console.log(`error in isLogin middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

export default isLogin

// import User from "../Models/userModels.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const isLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).send({ success: false, message: "Email not registered" });
//         }

//         // 2. Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).send({ success: false, message: "Invalid credentials" });
//         }

//         // 3. Generate JWT
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" } // 7 days expiry
//         );

//         // 4. Store token in cookie
//         res.cookie("jwt", token, {
//             httpOnly: true, // prevents JS access
//             secure: process.env.NODE_ENV === "production", // only https in prod
//             sameSite: "strict",
//             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//         });

//         // 5. Return response
//         res.status(200).send({
//             success: true,
//             message: "Login successful",
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 userName: user.userName
//             }
//         });

//     } catch (error) {
//         console.error("Error in login:", error.message);
//         res.status(500).send({
//             success: false,
//             message: "Server error: " + error.message
//         });
//     }
// };
// export default isLogin;
