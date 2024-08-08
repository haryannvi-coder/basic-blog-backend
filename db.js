const mongoose = require("mongoose")

async function connectDB(){
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/basicBlog`)
        console.log("MONGODB connnected");
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
    }
}

module.exports = connectDB



