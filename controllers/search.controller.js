

const {client} = require("../helpers/redis");

const axios = require("axios");

const {UserSearchList} = require("../model/serches.model")


const getInfo = async(req,res)=>{
    try {
        const ip = req.body.IP;
        client.get("ip", async(err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log(result); // Prints "value"
              if(result){
                console.log("Data from Redis")
                return  res.status(200).send({city:result});
              }else{
                const response = await axios.get(`https://ipapi.co/${ip}/city/`);

                const city = response.data;
                console.log("Data from Api")
                client.set("ip",city,"EX",6*60*60);
                await UserSearchList.findOneAndUpdate({userId:req.body.userId},{
                    userId:req.body.userId,$push:{previousSesrches:ip}
                },{new:true,upsert:true,setDefaultOnInsert:true})
                 res.status(200).send({city:city});
              }
            }
          });

        

    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}


module.exports={
    getInfo
}