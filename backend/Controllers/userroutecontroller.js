

import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        // Check if username OR email exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Username or Email already exists",
            });
        }

        // Hash password
        const hashPassword = bcryptjs.hashSync(password, 10);

        // Default avatar
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl,
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilepic: newUser.profilepic,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error fetching users" });
    }
}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email doesn't exist, please register",
            });
        }

        // check password
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) {
            return res.status(401).json({
                success: false,
                message: "Email or password doesn't match",
            });
        }

        // create JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // return user info + token
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                profilepic: user.profilepic,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};






export const userLogout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0
        })
        res.status(200).send({ message: "user logout" })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        })
        console.log(error);
    }

}