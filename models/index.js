const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/mybeverage')
const connect = async function(){
  try {
    await sequelize.authenticate()
    console.log('Connected to Database!')
  } catch (e) {
    console.log('Cannot setup db connection! ' + e)
  }
}

const User = function(sequelize, type){
  return sequelize.define('user', {
    id: {
      primaryKey: true,
      type: type.INTEGER,
      autoIncrement: true
    },
    username: {
      type: type.STRING,
      unique: true
    },
    password: type.STRING
  });
}

const Category = function(sequelize, type){
  return sequelize.define('category', {
    id: {
      primaryKey: true,
      type: type.INTEGER,
      autoIncrement: true
    },
    name: type.STRING
  });
}

const Drink = function(sequelize, type){
  return sequelize.define('drink', {
    id: {
      primaryKey: true,
      type: type.INTEGER,
      autoIncrement: true
    },
    category: {
      type: type.STRING
    },
    name: type.STRING,
    imageUrl: type.STRING,
    comment: type.STRING
  });
}

const session = ""
const isLogin = function(){
  return this.session != '' && this.session != null
}

module.exports = {
  connect,
  User: User(sequelize, Sequelize),
  Category: Category(sequelize, Sequelize),
  Drink: Drink(sequelize, Sequelize),
  session: session,
  isLogin: isLogin
}