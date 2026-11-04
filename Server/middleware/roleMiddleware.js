const roleMiddleware = (requiredRole)=>{
    return (req ,res, next)=>{

        if(!req.user){
            return res.status(401).json({
                message :"athuntication requried"
            });
        }


        if(req.user.role !== requiredRole){
            return res.status(403).json({
                meesage: "Access forbidden"
            });
        }
        next();
    }

};


module.exports = roleMiddleware;