import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//Post/auth/register

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    // check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "email already registered" });
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return success (avoid sending password back)
    res.status(201).json({
      message: "user registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("register error :", error);
    res.status(500).json({ message: "server error" });
  }
});

// post/auth/login

router.post("/login",async(req,res)=>{
  try {
    const {email,password}=req.body;

    // validate

    if(!email||!password){
      return res.status(400).json({message:"email and password are required"})
    }

    //find user by mail

    const user=await User.findOne({email});

    if(!user){
      return res.status(401).json({message:"invalid credentials"})
    }

    //compare password with hashed password

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({message:"invalid credentials"})
    }

    //create JWT token

    const payload={
      userId:user._id,
    };

    const token=jwt.sign(payload,process.env.JWt_SECRET,{
      expiresIn:"1h" // token valid for one hour
    })

    // send token to client 
  res.json({
    message:"user registered successsfully",
    token,// client will store this in local storage
    user:{
      id:user._id,
      name:user.name,
      email
    }
  })

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
})


// GET /auth/me (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // authMiddleware has set req.user
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Fetch me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;