import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { registerEmail } from "../services/emailService.js"
0

dotenv.config();
export const registerController = async(req, res)=>{
    try{
        const {FirstName, lastName, email, password,} = req.body

        if(!FirstName || !lastName || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            FirstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        await registerEmail(FirstName, email);
        return res.status(201).json({
            message: "User register successfully",
            success: true
        })
    }
    catch(error){
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const loginController = async(req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        return res.status(200).json({
            message: "Login successful",
            success: true
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const verifyController = async (req, res) => {
  try {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = null; 
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};