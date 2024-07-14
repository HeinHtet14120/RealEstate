import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(token, jwtSecretKey, async (err, payload) => {
        if (err) return res.status(403).json({ message: err.message })

        req.userId = payload.id;

        next();
    });
};