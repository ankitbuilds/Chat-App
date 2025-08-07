import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    fullname:{
        type:String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        required: true,
        enum:["male","female"]
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        required: false,
    }
},{timestamps : true});

const User=mongoose.model('User',userSchema);
export default User;