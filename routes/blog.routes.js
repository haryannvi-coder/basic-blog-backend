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

router.put("/editBlog", authMiddleware, async (req, res) => {
    const blogId  = req.query.blogId; // Extract blogId from query parameters
    const { title, description, content } = req.body; // Extract updated fields from request body

    try {        
        // Retrieve the blog by its ID
        const blog = await Blog.findById(blogId);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            });
        }

        // Verify if the user is the owner of the blog
        if (blog.owner.toString() !== req.userID) {
            return res.status(403).json({
                msg: "User not allowed to update this blog"
            });
        }

        // Validate the new data (Assume you're using Zod for validation)

        // Update the blog fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.content = content || blog.content;

        // Save the updated blog back to the database
        await blog.save();

        // Return the updated blog
        res.json({
            msg: "Blog updated successfully",
            blog
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({
            msg: "An error occurred while updating the blog",
            error: error.message
        });
    }

})

router.delete("/deleteBlog", authMiddleware, async (req, res) => {
    const blogId  = req.query.blogId; // Extract blogId from query parameters

    try {        
        // Retrieve the blog by its ID
        const blog = await Blog.findById(blogId);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            });
        }

        // Verify if the user is the owner of the blog
        if (blog.owner.toString() !== req.userID) {
            return res.status(403).json({
                msg: "User not allowed to delete this blog"
            });
        }

        // Save the updated blog back to the database
        await blog.deleteOne();

        // Return the updated blog
        res.json({
            msg: "Blog deleted successfully",
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({
            msg: "An error occurred while updating the blog",
            error: error.message
        });
    }

} )


module.exports = router