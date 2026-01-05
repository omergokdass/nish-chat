import { Request, Response } from "express";
import User from "../modals/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";

import { sendVerificationEmail } from "../utils/emailService";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, avatar } = req.body;
    try {
        // check if already exists
        let user: any = await User.findOne({ email });

        if (user && user.isVerified) {
            res.status(400).json({ success: false, msg: "User already exists" });
            return;
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        if (user && !user.isVerified) {
            // Update existing unverified user
            user.password = password; // In case they changed it
            user.name = name;
            user.avatar = avatar || "";
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = verificationCodeExpires;

            // Re-hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
        } else {
            // create new user
            user = new User({
                email,
                password,
                name,
                avatar: avatar || "",
                isVerified: false,
                verificationCode,
                verificationCodeExpires
            });

            // hash the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // save user
            await user.save();
        }

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);

        if (!emailSent) {
            res.status(500).json({ success: false, msg: "Failed to send verification email" });
            return;
        }

        res.json({
            success: true,
            msg: "Verification code sent to your email",
            requiresVerification: true,
            email: email
        })
    } catch (error) {
        console.log("Register error:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const verifyCode = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;
    try {
        const user: any = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, msg: "User not found" });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ success: false, msg: "User already verified" });
            return;
        }

        if (user.verificationCode !== code) {
            res.status(400).json({ success: false, msg: "Invalid verification code" });
            return;
        }

        if (user.verificationCodeExpires < new Date()) {
            res.status(400).json({ success: false, msg: "Verification code expired" });
            return;
        }

        // Verify user
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        const token = generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.log("Verify error:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const resendCode = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        const user: any = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, msg: "User not found" });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ success: false, msg: "User already verified" });
            return;
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        await sendVerificationEmail(email, verificationCode);

        res.json({ success: true, msg: "Verification code resent" });

    } catch (error) {
        console.log("Resend code error:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {

        // find user by email

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, msg: "Invalid credentials" });
            return;
        }

        if (!user.isVerified) {
            res.status(400).json({ success: false, msg: "Please verify your email first", requiresVerification: true });
            return;
        }

        // compare passwords

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, msg: "Invalid credentials" });
            return;
        }
        // gen token 

        const token = generateToken(user);

        res.json({
            success: true,
            token
        })
    } catch (error) {

    }
};