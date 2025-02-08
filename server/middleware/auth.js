import jwt from "jsonwebtoken";

//wants to like a post
// click the like button => auth middleware (next) => like controller...
const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const isCustomAuth = token.length < 500; // If it's our own JWT

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id; // Custom user ID from MongoDB
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; // Google user ID
    }

    next();
  } catch (error) {
    console.log("Authentication Middleware Error:", error);
    return res.status(403).json({ message: "Unauthorized" });
  }
};

export default auth;
