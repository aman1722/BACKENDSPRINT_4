const mongoose = require("mongoose");



const userSearches=mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    previousSesrches:[{type:String,required:true}]
})



const UserSearchList=mongoose.model("serches",userSearches)

module.exports={
    UserSearchList
}