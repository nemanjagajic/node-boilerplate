const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')
const config = require('config')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    _id: this._id
  },
    config.get('jwtPrivateKey')
  )
}

const User = mongoose.model("User", userSchema)

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(1)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
