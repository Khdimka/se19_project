
import jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. Not authorized.");

try {
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid auth token.");
  }
}
export default auth;
