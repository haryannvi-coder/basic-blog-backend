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
            msg : "Error saving blog",
            error : err
        })
    }    
})

router.get("/getBlogs", async (req, res) => {
    const keyword = req.query.filter || "";

    try {
        // Fetch blogs based on the keyword
        const blogs = await Blog.find({ 
            $or: [{
                title: {
                    "$regex": keyword, // Correct regex syntax
                    "$options": "i" // Case-insensitive search
                }
            }]
        });

        // Send the formatted blogs
        res.json(blogs);
    } 
    catch (error) {
        // Send an error response
        res.status(400).json({ 
            msg: "Can't find blogs",
            message: error.message 
        });
    }
});


router.get("/readBlog", async (req, res) => {
    try {
        const blogId = req.query.blogId; 

        const blog = await Blog.findById(blogId);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({ msg: "Blog not found" });
        }

        // Send the blog data as a JSON response
        res.json(blog);
    } catch (err) {
        // Handle any errors that occur during the operation
        res.status(500).json({ msg: "Server error", error: err.message });
    }

})

module.exports = router