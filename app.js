//Constants config

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
require('./models/Post')
const Post = mongoose.model('posts')
require('./models/Category')
const Category = mongoose.model('categories')
const users = require('./routes/user')


//Config

	//Session
		app.use(session({
			secret: 'secret459012@!', //O ideal é colocar uma secret segura para melhorar a segurança da aplicação
			resave: true,
			saveUninitialized: true
		}))
		//Flash
		app.use(flash())

	//Middleware
	app.use((req, res, next) => {
		res.locals.success_msg = req.flash('success_msg')
		res.locals.error_msg = req.flash('error_msg')
		next()
	})

	//Body Parser
		app.use(bodyParser.urlencoded({extended: true}))
		app.use(bodyParser.json())

	//Handlebars

	app.set('views', __dirname + '/views'); 
	app.set('view engine', 'ejs');
	
	app.engine('handlebars', handlebars({defaultLayout: 'main'}))
	app.set('view engine', 'handlebars')

	//Static Files
		app.use(express.static(path.join(__dirname, 'public')))

	//Mongoose
		mongoose.Promise = global.Promise

		mongoose.connect('mongodb://localhost/blogapp', { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
			console.log('Mongo connected')
		}).catch((err) => {
			console.log('Error' + err)
		})

		

//Routes
app.get('/', (req,res) => {
	Post.find().lean().populate('categories').sort({date: 'desc'}).then((posts) => {
		res.render('index', {posts: posts})
	}).catch((err => {
		req.flash('error_msg', 'There was an error loading the posts')
		res.redirect('/404')
	}))
})

app.get('/post/:slug', (req, res) => {
	Post.findOne({slug: req.params.slug}).lean().then((post) => {
		if(post){
			res.render('post/index', {post : post})
		}else{
			// req.flash('error_msg', 'Essa postagem não existe')
			res.redirect('/404')
		}
	}).catch((err) => {
		req.flash('error_msg', 'There was an error loading the post, try again later')
		res.redirect('/')
	})
})


app.get('/categories', (req, res) => {
	Category.find().lean().then((categories) => {
		res.render('categories/index', {categories: categories})
	}).catch((err) => {
		req.flash('error_msg', 'There was an error loading the categories, try again later')
		res.redirect('/')
	})
})

app.get('/categories/:slug', (req, res) => {
	Category.findOne({slug: req.params.slug}).lean().then((category) => {
		if(category){
			Post.find({category: category._id}).lean().then((posts) => {
				res.render('categories/posts', {posts: posts, category: category})
			}).catch((err) => {
				req.flash('error_msg', 'There was an error while showing the posts')
				res.redirect('/')
			})
		}else{
			req.flash('error_msg', 'This category does not exist')
			res.redirect('/')
		}
	}).catch((err) => {
		req.flash('error_msg', 'There was an error while loading this category')
		res.redirect('/')
	})
})


app.get('/404', (req, res) => {
	// res.send('Error 404!')
	res.render('error/index')
})



//Secondary Routes
app.use('/admin', admin)

app.use('/users', users)

//Localhost Port
app.listen(8081, () => {
	console.log("Servidor ativo")
})



// Falta fazer uma 404 bonitinha