const router = require('express').Router()

const { Blog } = require('../models')
const { Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({ 
    group: 'author',
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('likes')), 'blogs'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
    ]
  })
  res.json(blogs)
})

module.exports = router