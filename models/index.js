const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasOne(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'usersMarked' })


//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
  Blog, User, UserBlogs, Session
}