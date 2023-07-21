const User = require("../models/userModel")



module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        //check admin
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'auth failed'
            })
        }
        else next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'auth failed, admin api',
            error
        })
    }
}