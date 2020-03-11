const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')
const config = require('config')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  socialId: {
    type: String,
    default: null
  }
})

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    _id: this._id
  },
    config.get('jwtPrivateKey')
  )
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
