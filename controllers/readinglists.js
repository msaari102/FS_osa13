const router = require('express').Router()

const { UserBlogs } = require('../models')

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

module.exports = router