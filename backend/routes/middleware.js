const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleWare = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(403).json({});
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = await jwt.verify(token,JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.userid;
        next();
    }catch(err){
        return res.status(403).json({
            err
        })
    }
}

module.exports = {
    authMiddleWare
}