const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Session, User } = require('../models')

router.delete('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const session = await Session.findOne({ 
    where: { 
      userId: user.id
    }
  })
  if (session) {
    await session.destroy()
  }
  res.status(204).end()
})

module.exports = router