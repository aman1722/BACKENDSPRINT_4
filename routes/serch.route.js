const express = require("express");
const { auth } = require("../middlewares/auth");
const { getInfo } = require("../controllers/search.controller");

const searchRouter = express.Router();

searchRouter.get("/city",auth,getInfo)



module.exports={
    searchRouter
}