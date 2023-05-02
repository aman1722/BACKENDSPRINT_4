const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { client } = require("../helpers/redis");




const signup = async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const isUserPresent = await UserModel.findOne({email});
        if(isUserPresent) return res.status(200).send("User already exists! Please Login!")

        const hash = await bcrypt.hash(password,5);

        const newUser = new UserModel({name,email,password:hash});

        await newUser.save();

        res.status(200).send("SignUp Sucessful")

        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}



const login = async(req,res)=>{
    try {
        const {email,password}=req.body;
        const isUserPresent = await UserModel.findOne({email});
        if(!isUserPresent) return res.status(200).send("User not exists, Please signup!");

        const isPasswordCorrect = await bcrypt.compare(password,isUserPresent.password);

        if(!isPasswordCorrect) return res.status(200).send("Invalid Credentials");


        const token = await jwt.sign({userId:isUserPresent._id},process.env.TOKEN_SECRET,{expiresIn:"1hr"});

        res.status(200).send({"msg":"login sucessful",token})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}



const logout = async(req,res)=>{
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(403);
        await client.set(token,token);
        res.status(200).send({"msg":"Logout Sucessful"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}


module.exports={
    signup,
    login,
    logout
}
