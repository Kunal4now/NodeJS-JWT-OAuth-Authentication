const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Verifies if the token attached to the incoming request is valid or not
// 1. If the token is valid then data is attached to the request
// 2. If not valid, then it is redirected to the home page
const fetchuser = (req, res, next) => {
    const token = req.cookies.token
    if (token === undefined) {
        return res.redirect('/auth/login')
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next();
    } catch(error) {
        return res.redirect('/auth/login')
    }
}

module.exports = fetchuser;