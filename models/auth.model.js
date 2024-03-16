const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const session=require('express-session');
const sessionStore=require('connect-mongodb-session')(session);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', UserSchema);

const createUser = async (name, email, password) => {
    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            throw new Error('User already exists');
        } else {
            const hash = await bcrypt.hash(password, 10);
            const user = new User({
                name: name,
                email: email,
                password: hash
            });
            return await user.save();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const login= async(email,password)=>{
    try{
        const emailExists=await User.findOne({email:email});
        if(!emailExists){
            throw new Error('Invalid email or password');
        }
        const isMatch=await bcrypt.compare(password,emailExists.password);
        if(!isMatch){
            throw new Error('Invalid email or password');
        }
        return emailExists._id;
    }
    catch(err){
        throw new Error(err);
    }
}

module.exports = {
    User,
    createUser,
    login
};
