const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const isEmail = require('validator/lib/isEmail')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail, 'Invalid Email']
  },
  refreshToken: {
    type: [String]
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'USER'
  }
})

// Hash password so it can't be seen w/ access to database
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)
