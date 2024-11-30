import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      .json({ ...rest, message: "Signin successful" });
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
        .json({ ...rest, message: "Signin successful" });
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
        .json({ ...rest, message: "Signin successful" });

    } catch (err) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
