const userModel=require("../models/user.model");
const bcrypt=require('bcrypt'); 
const jwt=require('jsonwebtoken');
module.exports.authuser=async(req,res,next)=>{
    const token =req.cookies.token || req.header('Authorization').split(' ')[1];
    if(!token) return res.status(401).json({message:'Access denied. No token provided.'});
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await userModel.findById(decoded._id)
        req.user=user;
        return next();
        
    }
    catch(err){
        return res.status(401).json({message:'Invalid token'})
    }
}