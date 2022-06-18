const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Checks where the user is already loggedin or not
// If the user is already loggedin then it redirects it to the dashboard to prevent user accessing the longin and signup pages
const checkUserAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (token === undefined) {
            next()
        } else {
            const data = jwt.verify(token, JWT_SECRET)
            req.user = data.user;
            res.redirect('/dashboard')
        }
    } catch(error) {
        next()
    }
}

module.exports = checkUserAuthenticated;