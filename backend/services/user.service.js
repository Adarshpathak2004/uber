const userModel = require("../models/user.model");

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error('Required fields missing');
    }

    const user = await userModel.create({
        fullname: { firstname, lastname },
        email,
        password,
    });

    // Remove password before returning to avoid leaking the hash
    if (user && user.password) user.password = undefined;
    return user;
};