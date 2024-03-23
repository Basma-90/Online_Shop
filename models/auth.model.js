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
    },
    isAdmin:{
        type:Boolean,
        default:false
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

const login = async (email, password) => {
    try {
        const emailExists = await User.findOne({ email: email });
        if (!emailExists) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, emailExists.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        return { _id: emailExists._id, isAdmin: emailExists.isAdmin };
    } catch (err) {
        throw new Error(err);
    }
};
const getEmail = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.email;
    } catch (err) {
        console.log(err);
    }
};

const getUserId=async (email)=>{
    try {
        const user = await User.findOne({email:email});
        if (!user) {
            throw new Error('User not found');
        }
        return user._id;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    User,
    createUser,
    login,
    getEmail,
    getUserId
};
