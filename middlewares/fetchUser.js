const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const fetchuser = async (req, res, next) => {
    const token = req.cookies.token
      if (!token) {
        res.render('index')
        //   res.redirect('/')
        // return res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (err) {
        res.render('index')
        // res.redirect('/', {error: err})
        // return res.status(401).send({error: err})
    }
}

module.exports = fetchuser