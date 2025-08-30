const authorizeUser = (role) => {
    return (req, res, next) => {
        if(role.includes(req.role)) {
            next();
        } else {
            return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
        }
    }
};

module.exports = authorizeUser;