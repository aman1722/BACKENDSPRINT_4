const jwt = require("jsonwebtoken");
const {client} = require("../helpers/redis");



const auth = async(req,res,next)=>{
    try {
        const token = req.headers?.authorization?.split(" ")[1];
    if(!token) return res.status(401).send("Please Login again");

    const isTokenValid = await jwt.verify(token,process.env.TOKEN_SECRET);

    if(!isTokenValid) return res.status(401).send("Authentication Failed! Please login again");


    const isTokenBlacklisted = await client.get(token);

    if(isTokenBlacklisted) return res.status(401).send("Unauthorise");

    req.body.userId = isTokenValid.userId; 
    next()
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }

}


module.exports={
    auth
}