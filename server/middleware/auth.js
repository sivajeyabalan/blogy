import jwt from "jsonwebtoken";

// Secret key for JWT token
const secret = "test";

// Authentication middleware to check if the user is authorized
const auth = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    const isCustomAuth = token.length < 500; // Check if it's our own JWT (not a Google token)

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id; // Set user ID from MongoDB if it's a custom token
    } else {
      decodedData = jwt.decode(token); // Decode the Google token
      req.userId = decodedData?.sub; // Set user ID from Google
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

export default auth;
