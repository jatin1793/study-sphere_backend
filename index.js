require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2
const storage = require("./middleware/multer.js");
const PORT = process.env.PORT || 8080
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



var crypto = require("crypto");
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_KWOIl1E1t3eaDU',
  key_secret: '7UFprUC1MmHn4f2TADDmNXjy',
});

app.post('/create/orderID', (req, res, next) => {
    var options = {
        amount: 50000,
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
        return res.send(order);
    });
});

app.post("/api/payment/verify", (req, res) => {

    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var expectedSignature = crypto.createHmac('sha256', '7UFprUC1MmHn4f2TADDmNXjy')
        .update(body.toString())
        .digest('hex');

    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);

    var response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.response.razorpay_signature)
        response = { "signatureIsValid": "true" }
    res.send(response);
});

app.listen(
    PORT,
    console.log(`server running on port ${PORT}`)
);
