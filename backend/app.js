const dotenv=require('dotenv');
dotenv.config();
const express = require('express');
const cors=require('cors');
const app=express();
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const connectToDb=require('./db/db');
const userRoutes=require('./routes/user.routes');
connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello World!')}) ; 
    app.use('/users',userRoutes);
app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });  
    module.exports=app;  