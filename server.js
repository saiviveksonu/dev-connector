const express=require("express");
const app=express();
const cors=require('cors')
const Serverdatabse=require("./db/conn");
const path=require('path')
const port=process.env.port ||4000;
app.use(cors());
// connecting the database
Serverdatabse();
// initalixing the middelware to get data
app.use(express.json({extended:false}));
// creating the routing 
// "/api/users" = "/" in the routes/api file path defined over there 
// app.use(require("./routes/api/user"))
app.use("/api/users",require("./routes/api/user"))
// "/api/profile" = "/" in the routes/api file path defined over there
app.use("/api/profile",require("./routes/api/profile"))
// "/api/auth" = "/" in the routes/api file path defined over there
app.use("/api/auth",require("./routes/api/auth"))
// "/api/post" = "/" in the routes/api file path defined over there
app.use("/api/post",require("./routes/api/post"))
// app.get("/",(req,res)=>{
// res.send("this is home page")
// })

// sever static assets in production
if(process.env.NODE_ENV==='production'){
app.use(express.static('client/build'))

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
})
}  

app.listen(port,()=>{
console.log(` listening to the port no:${port}`);
})