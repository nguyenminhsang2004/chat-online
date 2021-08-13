const mongoose = require('mongoose');

let users = new mongoose.Schema(
    {
        id:{type:String},
        full_name:{type:String},
        email:{type:String},
        password:{type:String},
        active:{type:Boolean}
    }
);

const userModel = mongoose.model('users',users);

addNewUser = async (user) => {
    let newUser = new userModel(user);
    return await newUser.save();
}

userLogin = async (email) => {
    return await userModel.findOne({email:email}).exec();
}

updatePass = async (user) => {
    return await userModel.findByIdAndUpdate(user._id, {password:user.password}).exec();
} 

verifyEmail = async (id) => {
    return await userModel.findByIdAndUpdate(id, {active: true});
}

module.exports = {
    addNewUser: addNewUser,
    userLogin: userLogin,
    updatePass: updatePass,
    verifyEmail: verifyEmail
}