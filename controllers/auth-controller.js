exports.getLogIn = (req, res) => {
    res.render('login')
}

exports.getSignUp = (req, res) => {
    res.render('signup')
}

exports.create = async (req, res) => {    
    try {
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({error: "Sorry a user with this email is already registered"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken})
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.postLogIn = (req, res) => {
    
}

exports.postSignUp = (req, res) => {
    const {username, email, password} = req.body
    
    console.log(username, email, password)
}