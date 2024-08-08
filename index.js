const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./db.js")
const userRouter = require("./routes/user.routes.js")
const blogRouter = require("./routes/blog.routes.js")
const cors = require("cors")
require('dotenv').config()

// console.log(, process.env.JWT_SECRET);


app.use(cors())
app.use(express.json())

connectDB();

app.use("/api/v1/user", userRouter)
app.use("/api/v1/blog", blogRouter)

app.listen(port, ()=>{
    console.log("app is running at port =>", port);
})
