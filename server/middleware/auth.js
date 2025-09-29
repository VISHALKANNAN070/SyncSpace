import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: "No token provided. Login first."});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({message:"Invalid or expired token."});
        }
        req.user = user;
        next();
    })
}

export default verifyToken;