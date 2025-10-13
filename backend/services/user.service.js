const userModel = require("../models/user.model");
module.exports.createUser=async({
    firstname,lastname,email,password
})=>{
    if(!firstname || !email || !password){
        throw new Error('Required fields missing');
    }   
    // Ensure we wait for the create operation so callers receive the actual document
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    return user;
}