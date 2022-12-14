const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const SECRET_CODE = process.env.SECRET_CODE

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    email: { type: String, required: true, unique: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 7, maxlength: 2000 },
    resetToken: { type: String },
    resetTokenExpiration: Date,
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, SECRET_CODE)
}

userSchema.methods.generateResetToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, SECRET_CODE)
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema)
}

module.exports.User = User
module.exports.validate = validateUser