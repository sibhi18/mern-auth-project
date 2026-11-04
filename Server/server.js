const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/mongoDB");
const authRouter = require("./Router/authRouter")
const user = require("./model/user.js");
const authMiddleware = require("./middleware/authMiddleware.js")
const roleMiddleware = require("./middleware/roleMiddleware.js")
const cors = require("cors");

const app = express();

app.use(cors({
    origin:"http://localhost:5173"
}))

app.use(express.json());
app.use("/api",authRouter);

const PORT = process.env.PORT || 5000;

connectDB().catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
});


app.get("/api/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

app.get("/api/me" , authMiddleware, async (req, res)=>{

    try {
        const foundUser = await user.findById(req.user.id);

        if(!foundUser){
            return res.status(404).json({
                meesage: "user not found"
            });
        }

        res.status(200).json({
            user:{
                id :foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
            }
        })

    }catch(err){
        res.status(500).json({
            meassage: "failed to fetch"
        })
    }
})



app.get(
    "/api/admin",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the admin dashboard",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);


app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: "Internal server error"
    });
});



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
