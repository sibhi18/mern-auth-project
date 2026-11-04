const Jwt = require("jsonwebtoken")
const user = require("../model/user.js")

const authMiddleware = async (req , res , next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(400).json({
            message: "access token deined "
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decode = Jwt.verify(token, process.env.JWT_SECRET)

         const foundUser = await user.findById(decode.id)
            .select("-password");

        if (!foundUser) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = foundUser;
        next();

       
    }catch(err){
        return res.status(401).json({
            message:" access failed"
        });
    }


}

module.exports = authMiddleware;