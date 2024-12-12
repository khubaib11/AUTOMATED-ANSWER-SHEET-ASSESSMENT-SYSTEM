import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jwt.verify(token,process.env.TOKEN_KEY,(err,user)=>{
        if(err){
            return  res.status(401).json({ message: "Unauthorized" });
        }
        req.user=user;
        next();
    })
}