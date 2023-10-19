require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2
const storage = require("./middleware/multer.js");

// db connection

// cors
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

// logger
const logger = require("morgan");
app.use(logger("tiny"));

// bodyparser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));


// session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(cookieparser());

// routes
require("./models/mongoConnection.js").connectDB();

app.use("/student", require("./routes/studentRoutes.js"));
app.use("/instructor", require("./routes/instructorRoutes.js"));
 
// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","http://localhost:5173");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin,X-Requested-With,Content-Type,Accept",
//     );
//     next();  
// })  
          

app.listen(
    process.env.PORT,
    console.log(`server running on port ${process.env.PORT}`)
);
