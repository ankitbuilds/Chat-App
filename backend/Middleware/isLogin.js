import jwt from 'jsonwebtoken'
import User from '../Models/userModels.js'

const isLogin = (req,res,next)=>{
    try{
        console.log(req.heaers.cookie.jwt);
        const token = req.cookies.jwt;
        if(!token) return res.status(500).send({success:false,message:'User unauthorize'});
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode) return res.status(500).send({success:false,message:'User unauthorize - Invalid Token'});
        const user=User.findById(decode.userId).select('-passowrd');
        if(!user) return res.status(500).send({success:false,message:'User not found'});
        req.user=user,
        next()
    }catch(error){
        console.log(`error in islogin middleware ${error.message}`);
        res.status(500).send({
            success:false,
            message:error
        })

    }

}
export default isLogin;