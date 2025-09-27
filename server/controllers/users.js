import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUser,
} from "../database/queries.js";

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error("JWT_SECRET is not defined in environment variables");
}

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await createUser({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, googleId, imageUrl } = req.body;

  try {
    let existingUser = await findUserByEmail(email);

    if (!existingUser) {
      const newUser = await createUser({
        email,
        name,
        googleId,
        imageUrl,
        password: `google_${googleId}`,
      });

      console.log("Created new user:", newUser);
      existingUser = newUser;
    } else {
      existingUser = await updateUser(existingUser.id, {
        googleId,
        imageUrl,
      });
      console.log("Updated existing user:", existingUser);
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Google Sign In Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong with Google Sign In" });
  }
};
