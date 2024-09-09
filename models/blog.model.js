const mongoose = require("mongoose");
const User = require("./user.model.js")

const blogSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    content : {
        type: String, 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
}, {timestamps: true}) // Enable timestamps

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;