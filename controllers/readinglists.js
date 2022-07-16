const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { User, UserBlogs } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', async (req, res) => {
  if (req.body.user_id) req.body.userId = req.body.user_id
  if (req.body.blog_id) req.body.blogId = req.body.blog_id
  try {
    const readings = await UserBlogs.create(req.body)
    res.json(readings)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await UserBlogs.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)
  if (reading.userId !== user.id) throw ('Wrong user')
  if (reading) {
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  } else {
    res.status(404).end()
  }
})

module.exports = router