const express = require('express')
const bodyParser = require('body-parser')
const Model = require('../models')
const md5 = require('md5');
const rounter = express.Router()

const urlencodedParser = bodyParser.urlencoded({ extended: true})

Model.connect()

rounter.route('/sign_up').get(function(rq, rs){
  rs.render('users/sign_up', { loginPage : true })
})

rounter.route('/login').get(function(rq, rs){
  rs.render('users/login', { loginPage : true })
})

rounter.route('/logout').get(function(rq, rs){
  Model.session = '';
  rs.render('users/login', { loginPage : true })
})

rounter.route('/session').post(urlencodedParser, async function(rq, rs){
  const { username, password } = rq.body
  const user = await Model.User.findOne({ where: { username: username, password: md5(password) }})
  if(user == null)
    rs.render('users/login', { loginPage : true, error : 'Username or Password not match!' })
  Model.session = user.username;
  rs.redirect(`/drinks`)
})

rounter.route('/').post(urlencodedParser, async function(rq, rs){
  const { username, password, confirmPassword } = rq.body
  if(password !== confirmPassword){
    rs.render('users/sign_up', { loginPage : true, error: 'Your password is not equal!' })
  }
  await Model.User.create({username: username, password: md5(password)})
  Model.session = username;
  rs.redirect(`/drinks`)
})

module.exports = rounter