import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const isCustomAuth = token.length < 500;

    let decodedData;

    if (isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    if (!req.userId) {
      return res.status(403).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ message: "Unauthorized" });
  }
};

export default auth;
