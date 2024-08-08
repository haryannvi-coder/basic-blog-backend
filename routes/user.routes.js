const express = require("express")
const router = express.Router();
const zod = require("zod");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const jwt = require("jsonwebtoken");

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post('/signup', async function (req, res){
    const { success } = signupBody.safeParse(req.body)
    if(success == false){
        res.status(404).json({
            msg : "invald credentials types"
        })
        return;
    }

    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
        res.status(404).json({
            msg: "Email already taken"
        });
        return;
    }

    try{
        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })

        const token = jwt.sign({
            userID: newUser._id 
        }, process.env.JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        })
        return;
    } 
    catch (err){        
        res.status(411).json({
            msg : "Error saving user",
            error : err
        })
    }
})

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (success == false) {
        return res.status(411).json({
            message: "Invalid credentials types"
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userID: user._id
        }, process.env.JWT_SECRET);
  
        res.json({
            msg : "log in successfull",
            token: token
        })
    }
    else{
        res.status(411).json({
            message: "wrong credentials",
        })
    }
})

module.exports = router