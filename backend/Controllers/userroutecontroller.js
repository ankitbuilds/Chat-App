import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import jwtToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        // Check if username OR email exists
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (fullname && username && email && gender && password && profilepic) {
            console.log(fullname, username, email, gender, password, profilepic)
        }

        if (user) {
            return res.status(400).send({
                success: false,
                message: "Username or Email already exists",
            });
        }

        const hashPassword = bcryptjs.hashSync(password, 10);
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

        // Generate and send JWT (assumes jwtToken sets cookie but doesn't send response)
        jwtToken(newUser._id, res);

        return res.status(201).send({
            success: true,
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email,
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).send({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        return res.status(201).send(users);
    } catch (err) {
        console.error(err);
        return err;
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).send({ success: false, message: "Email Doesn't exist register" })
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) return res.status(500).send({ success: false, message: "Email or password doesn't match" })

        jwtToken(user._id, res)
        res.send(200).send({
            _id: user.fullname,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Successfully Login"
        })

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        })
        console.log(error);

    }
}

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