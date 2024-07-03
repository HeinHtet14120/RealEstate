import jwt from "jsonwebtoken"

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const shouldBeLoggIn = async (req, res) => {
    console.log(req.userId);
    res.status(200).json({ message: "You are Authenticated" })
}

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(token, jwtSecretKey, async (err, payload) => {
        if (err) return res.status(403).json({ message: "Token is not valid" })

        if (!payload.isAdmin) return res.status(403).json({ message: "You don't have permission" })
    })

    res.status(200).json({ message: "You are Admin" })
}

