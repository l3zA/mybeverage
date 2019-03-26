const express = require('express')
const bodyParser = require('body-parser')
const Model = require('../models')
const rounter = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: true})

rounter.route('/new').get(function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  rs.render('categories/new', { user : user})
})

rounter.route('/:id/edit').get(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const category = await Model.Category.findOne({ where: { id: id }, raw: true})
  if(typeof category !== 'undefined')
    rs.render('categories/edit', { id : id, name : category.name })
  else
    rs.redirect('/categories')
})

rounter.route('/:id').get(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const category = await Model.Category.findOne({ where: { id: id }, raw: true})
  if(typeof category !== 'undefined')
    rs.render('categories/get', { id : id, name : category.name })
  else
    rs.redirect('/categories')
}).put(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const { name } = rq.body
  await Model.Category.update({ name: name }, { where :{id, id} });
  
  rs.redirect('/categories')
}).delete(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  await Model.Category.destroy({ where: { id: id }})
  rs.redirect('/categories')
})

rounter.route('/').get(async function(rq, rs){
  let user = ""
  if(Model.isLogin()){
    user = Model.session
  }else
    rs.redirect('/users/login')
  const categories = await Model.Category.findAll({ raw: true, order: [[ 'id', 'ASC' ]] })
  rs.render('categories/index', { categories: categories})
}).post(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { name } = rq.body
  await Model.Category.create({ user: user, name: name})
  rs.redirect(`/categories`)
})

module.exports = rounter