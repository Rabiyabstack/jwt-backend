const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token received:", token); 

    if (!token) {
        console.log("No token found, unauthorized."); 
        return res.status(401).json({ status: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log("Decoded user ID:", decoded.id); 

        const user = await User.findById(decoded.id);
        console.log("User found:", user); 

        if (!user) {
            console.log("User not found, unauthorized."); 
            return res.status(401).json({ status: false, message: "User not found" });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Token verification error:", error); 
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
};
