const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRATE);
        const { user } = decoded;
        req.user = user;
        next();
    }
    catch {
        res.status(401).send("Athentication failure");
    }
}

module.exports = checkUser;