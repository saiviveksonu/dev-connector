const mongoose=require("mongoose");
const config=require("config");
const database=config.get("DATABASE");
const Serverdatabse=async()=>{
    try {
        const conn=await mongoose.connect(database,{useCreateIndex:true, useNewUrlParser: true , useUnifiedTopology: true,useFindAndModify:false })
        console.log("mongodb connected")
    } catch (error) {
        console.log(error)
    }

}
module.exports=Serverdatabse;
