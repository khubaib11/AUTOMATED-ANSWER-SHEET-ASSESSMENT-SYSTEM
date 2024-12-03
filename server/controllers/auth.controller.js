import User from "../models/user.model.js";
import UserOTP from "../models/userOTP.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NOdeMailer from "nodemailer";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashpassword = bcrypt.hashSync(password, 10);

  try {
    // Check if all fields are provided
    if (!(name && email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate email format
    if (!(email && email.includes("@") && email.includes("."))) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Create a new user
    const newUser = new User({ name, email, password: hashpassword });

    try {
      // Save the new user
      await newUser.save();
      return res
        .status(201)
        .json({ name: name, email: email, message: "Signup successful" });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all fields are provided
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if the password is correct
    if (!bcrypt.compareSync(password, existingUser.password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create a token
    const token = jwt.sign(
      { user_id: existingUser._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // Save the token in the cookie
    const { password: pass, ...rest } = existingUser._doc;
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ ...rest, message: "Signin successful", isAuthenticated: true });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const googleSignIn = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if all fields are provided
    if (!(name && email)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // Create a token
      const token = jwt.sign(
        { user_id: existingUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Save the token in the cookie
      const { password: pass, ...rest } = existingUser._doc;
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ ...rest, message: "Signin successful", isAuthenticated: true });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(email + Math.random(1, 10) + name, 10),
    });

    try {
      // Save the new user
      await newUser.save();

      // Create a token
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Save the token in the cookie
      const { password: pass, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ ...rest, message: "Signin successful", isAuthenticated: true });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  const hashpassword = bcrypt.hashSync(password, 10);

  try {
    // Check if all fields are provided
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Update the password
    await User.updateOne({ email: email }, { password: hashpassword });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}


export const sendOTP = async (req, res) => {
  const email = req.body.email;

  // Check if the user exists
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  const transporter = NOdeMailer.createTransport({
    service: "gmail",
    // secure:true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Password Reset",
    text: `Dear User,

We received a request to reset your password. Please use the One-Time Password (OTP) below to proceed:

Your OTP is: ${otp}

This OTP is valid for 10 minutes and can only be used once. For your security, do not share this code with anyone.

If you did not request this OTP, please ignore this email or contact our support team immediately.

Best regards,  
Automated Answer Sheet Assessment System`,
  };
  const hashotp = bcrypt.hashSync(otp.toString(), 10);
  const userOTP = new UserOTP({
    email,
    otp: hashotp,
    createdAt: Date.now(),
    expireAt: Date.now() + 600000,
  });
  await userOTP.save();

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ message: "OTP sent successfully" });
    }
  });
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if an OTP exists for the user
    const userOTP = await UserOTP.findOne({ email });
    if (!userOTP) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // Check if the OTP is expired
    if (Date.now() > userOTP.expireAt) {
      await UserOTP.deleteOne({ email }); // Delete expired OTP
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify the OTP
    const isOTPValid = bcrypt.compareSync(otp, userOTP.otp);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete the OTP after successful verification
    await UserOTP.deleteOne({ email });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
