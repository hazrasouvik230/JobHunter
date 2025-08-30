const jwt = require("jsonwebtoken");

const authenticateUser = async(req, res, next) => {
    const token = req.headers["authorization"];
    if(!token) {
        return res.status(401).json({ error: "Authorization token is required"});
    }

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenData.userId;
        req.role = tokenData.role;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Invalid or expired token' });   
    }
};

module.exports = authenticateUser;