import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    const hashpassword=bcrypt.hashSync(password,10);

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
        if (!(email && email.includes('@') && email.includes('.'))) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Create a new user
        const newUser = new User({ name, email, password:hashpassword });

        try {
            // Save the new user
            await newUser.save();
            return res.status(201).json({ name: name, email: email, message: "Signup successful" });
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
        if (!bcrypt.compareSync(password,existingUser.password)) {
            return res.status(400).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Signin successful" });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}


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
            return res.status(200).json({ message: "Signin successful" });
        }

        // Create a new user
        const newUser = new User({ name, email, password: bcrypt.hashSync(email+Math.random(1,10)+name,10) });

        try {
            // Save the new user
            await newUser.save();
            return res.status(201).json({ name: name, email: email, message: "Signup successful" });
        } catch (err) {
            return res.status(500).json({ message: "Something went wrong" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};