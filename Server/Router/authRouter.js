const express = require("express")
const Jwt = require("jsonwebtoken")

const router = express.Router();
const bcrypt = require("bcryptjs");
const user = require("../model/user")

router.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;
      

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if(password.length < 8){
          return res.status(400).json({
            mesaage: " password should be at least 8 chareacter"
          });
        }

        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "successfullu created",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                
              },
        });
    } catch (err) {
        console.error("Registration failed:", err);
        res.status(500).json({
            message: "Registration failed"
        });
    }
});




router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = Jwt.sign(
        { id: foundUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    return res.status(200).json({
      message: "Login successful",
      token : token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

router.post("/logout", (req, res) => {
    return res.status(200).json({
        message: "Logout successful"
    });
});






module.exports = router;