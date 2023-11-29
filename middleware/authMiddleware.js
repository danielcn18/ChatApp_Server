const userSchema = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ message: "Unauthorized" });
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ message: "Unauthorized" });
        else {
            const user = await userSchema.findById(decoded.userId);
            if (res) return res.json({ user });
            else return res.json({ message: "No user with that id" });
        }
    });
}

module.exports = authMiddleware;