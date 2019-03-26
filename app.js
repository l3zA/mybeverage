const express = require ('express')

const morgan = require('morgan')
const methodOverride = require('method-override');

const app = express()

const users = require('./routes/users')

const categories = require('./routes/categories')
const drinks = require('./routes/drinks')

app.use(express.static('public'))
app.use(methodOverride('_method'));

app.use(morgan('combined'))

app.set('views', './views')
app.set('view engine', 'pug')

app.use('/users', users)

app.use('/categories', categories)
app.use('/drinks', drinks)

app.all('*', function(rq, rs){
  rs.redirect('/users/login')
})

app.listen(3000)
