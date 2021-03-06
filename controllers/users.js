const router = require('express').Router()
const { Blog, User, Session } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false]
  }
  if ( req.query.read ) {
    read = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, { 
    attributes: { exclude: [''] } ,
    include:[{
      model: Blog,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId']},
      through: {
        as: 'readinglists',
        attributes: ['id', 'read'],
        where: {
          read
        },
      },
    },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

// for testing purposes only
router.put('/disable/', async (req, res) => {
  const user = await User.findOne({ 
    where: { 
      username: req.body.username
    }
  })
  console.log(user)

  if (user) {
    user.disabled = req.body.disabled
    if (req.body.disabled) {
      const session = await Session.findOne({ 
        where: { 
          userId: user.id
        }
      })
      if (session) {
        await session.destroy()
      }
    }
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (req.body.name===undefined) throw ('Name missing')
  if (user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router