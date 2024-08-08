const express = require("express")
const router = express.Router();
const Blog = require("../models/blog.model");
const authMiddleware = require("../middleware/authMiddleware");
const zod = require("zod");

const blogBody = zod.object({
    title: zod.string(),
    description: zod.string(),
    content : zod.string(),
})


router.post("/addBlog", authMiddleware, async (req, res) => {
    console.log("authentication successful");
    console.log(req.userID, req.body);
    const { success } = blogBody.safeParse(req.body)
    if(success == false){
        res.status(404).json({
            msg : "invald credentials types"
        })
        return;
    }

    try {
        const newBlog = await Blog.create({
            title : req.body.title,
            description : req.body.description,
            content : req.body.content,
            owner : req.userID,
        })  
        res.json({
            message: "Blog created successfully",
        })
        return;

    } 
    catch (err) {
        console.log(err);
        
        res.status(411).json({
            msg : "Error saving user",
            error : err
        })
    }    
})

router.get("/getBlogs", async (req, res) => {
    try{
        console.log("blogs found");
        const blogs = await Blog.find({});
        console.log(blogs);
        
        res.json(blogs);
    }
    catch(err){
        res.status(400).json({ 
            msg : "can't find blog",
            message: err.message 
        });
    }
})

module.exports = router