const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session } = require('../models')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  //logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'TypeError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  next(error)
}

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

const tokenCheck = async (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = await Session.findOne({ 
        where: { 
          userId: decodedToken.id
        }
      })
      if (session === null) throw ('Please login')
      req.login = true;
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

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  tokenCheck,
}