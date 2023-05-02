const express = require("express");
const redis = require("ioredis");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { searchRouter } = require("./routes/serch.route");
const {logger} = require("./middlewares/logger")
require("dotenv").config()


const app = express();


//Middleware------->
app.use(express.json());



// base route----->
app.get("/",(req,res)=>{
    res.status(200).send("Home Page!")
})

app.use("/api/user",userRouter);
app.use("/api/get",searchRouter)



//listining--------->
app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("Connected to db!")
        logger.log("info","Database connected")
    } catch (error) {
        console.log(error.message)
        logger.log("error","Database connection fail")
    }
    console.log(`App is running on PORT ${process.env.PORT}!`)
})