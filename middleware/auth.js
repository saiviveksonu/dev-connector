const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
module.exports= function(req,res,next){
// get the token
const token=req.header('x-auth-token');
console.log(token)
if(!token){
    res.status(400).json({error:"token is empty"})
}
// verify the token
try {
    const tokenauth=jwt.verify(token,config.get("jwtSecret"));
    // tokenauth contains the object  playload in it
    // this is the id present in registration document
    req.user=tokenauth.user;
    next()
} catch (error) {
  console.log(error)  
  res.status(401).json({msg:"token is not valid"})
}
}