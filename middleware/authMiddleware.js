const jwt = require("jsonwebtoken");

function authMiddleware (req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg : "invalid auth header",
            invalidHeader : authHeader
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.userID){
            req.userID = decoded.userID;
            next();            
        }
        else{
            return res.status(403).json({
                msg : "userId does not exist, not registered user"
            });  
        }
    } 
    catch (err) {
        return res.status(403).json({
            msg : "auth middlware error"
        });
    }
};

module.exports = authMiddleware
