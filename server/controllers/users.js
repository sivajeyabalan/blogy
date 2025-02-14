import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const secret = "test"; // In production, use environment variable

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, googleId, imageUrl } = req.body; // Changed from 'picture' to 'imageUrl'

  try {
    console.log("Received Google user data:", req.body);

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      // Create new user if doesn't exist
      const newUser = await User.create({
        email,
        name,
        googleId,
        imageUrl, // Store the image URL
        password: `google_${googleId}`,
      });

      console.log("Created new user:", newUser);
      existingUser = newUser;
    } else {
      // Always update the Google user's image URL
      existingUser.googleId = googleId;
      existingUser.imageUrl = imageUrl;
      await existingUser.save();
      console.log("Updated existing user:", existingUser);
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log("Google Sign In Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong with Google Sign In" });
  }
};
