const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ username: req.body.username })
  if (user) return res.status(400).send('User already registered.')

  user = new User({
    username: req.body.username,
    password: req.body.password
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  res.send({ token })
}

exports.login = async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({ username: req.body.username })
  if (!user) return res.status(400).send('Invalid username or password.')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid username or password.')

  const token = user.generateAuthToken()
  res.send({ token })
}

exports.me = async (req, res) => {
  try {
    const user = await User
      .findById(req.user._id)
      .select(['username'])
    res.send(user)
  } catch (err) {
    res.status(400).send(err.message)
  }
}
