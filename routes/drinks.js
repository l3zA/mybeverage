const express = require('express')
const bodyParser = require('body-parser')
const Model = require('../models')
const Sequelize = require('sequelize')
const rounter = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: true})

rounter.route('/new').get(async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const categories = await Model.Category.findAll({ raw: true, order: [[ 'id', 'DESC' ]] })
  rs.render('drinks/new', {categories : categories})
})

rounter.route('/search').post(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { q } = rq.body
  rs.redirect(`/drinks?q=` + q)
})

rounter.route('/:id/edit').get(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const drink = await Model.Drink.findOne({ where: { id: id }, raw: true})
  const categories = await Model.Category.findAll({ raw: true, order: [[ 'id', 'DESC' ]] })
  console.log(drink)
  if(typeof drink !== 'undefined')
    rs.render('drinks/edit', { category : drink.category, id : id, name : drink.name, categories : categories })
  else
    rs.redirect('/drinks')
})

rounter.route('/:id').get(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const drink = await Model.Drink.findOne({ where: { id: id }, raw: true})
  if(typeof drink !== 'undefined')
    rs.render('drinks/get', { category : drink.category, id : id, name : drink.name })
  else
    rs.redirect('/drinks')
}).put(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  const { name, category } = rq.body
  await Model.Drink.update({ name: name, category: category }, { where :{id, id} });
  
  rs.redirect('/drinks')
}).delete(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { id } = rq.params
  await Model.Drink.destroy({ where: { id: id }})
  rs.redirect('/drinks')
})

rounter.route('/').get(async function(rq, rs){
  let user = ""
  if(Model.isLogin()){
    user = Model.session
  }else
    rs.redirect('/users/login')
  const { q } = rq.query
  console.log('q', q)
  let drinks = '';
  const Op = Sequelize.Op
  if(typeof q !== 'undefined')
    drinks = await Model.Drink.findAll({ raw: true, where: { name: { [Op.like]: '%' + q + '%' } } , order: [[ 'id', 'ASC' ]] })
  else
    drinks = await Model.Drink.findAll({ raw: true, order: [[ 'id', 'ASC' ]] })
  rs.render('drinks/index', { drinks: drinks })
}).post(urlencodedParser, async function(rq, rs){
  let user = ""
  if(Model.isLogin())
    user = Model.session
  else
    rs.redirect('/users/login')
  const { name, category } = rq.body
  await Model.Drink.create({ category: category, name: name})
  rs.redirect(`/drinks`)
})

module.exports = rounter