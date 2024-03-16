require('dotenv').config();
const mongoose = require('mongoose');

const dbConnct= async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
        });
        console.log('Connected to the database');
    } catch (error) {
        console.log('Failed to connect to the database');
    }
}


module.exports={dbConnct};
