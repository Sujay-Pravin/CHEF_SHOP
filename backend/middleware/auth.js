import jwt from "jsonwebtoken"

const authMiddleware = async (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({success:false,message:"Authentication required"})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next();
    }
    catch (error){
        console.error("Auth error:", error)
        res.status(401).json({success:false,message:"Authentication failed"})
    }
}

export default authMiddleware