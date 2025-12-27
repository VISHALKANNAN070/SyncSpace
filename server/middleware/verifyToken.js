import jwt from "jsonwebtoken"

// Middleware to verify JWT token from cookies
const verifyToken = (req,res,next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({message:"No token provided"})
        }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        
            next()
    } catch (err) {
        return res.status(401).json({message:"Invalid or Expired Token"})
    }
}

export default verifyToken