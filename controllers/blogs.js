const router = require('express').Router()
const { tokenCheck } = require('../util/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: req.query.search ? ('%' + req.query.search + '%') : '%%',
          }
        },
        {
          author: {
            [Op.iLike]: req.query.search ? ('%' + req.query.search + '%') : '%%',
          }
        }
      ]
    },
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenCheck, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id})
  res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenCheck, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog.userId !== user.id) throw ('Wrong user')
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.body.likes===undefined) throw ('Likes missing')
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router