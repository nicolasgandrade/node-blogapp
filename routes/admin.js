
//Consts
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Post')
const Post = mongoose.model('posts')
const { isAdmin } = require('../helpers/isAdmin')


//Routes
router.get('/', isAdmin, (req, res) => {
	res.render('admin/index')
})


//Categories
router.get('/categories', isAdmin, (req, res) => {
	Category.find().sort({date: 'desc'}).then((categories) => {
		res.render('admin/categories', {categories: categories.map(category => category.toJSON())})
	}).catch((err) =>{
		req.flash('error_msg', 'There was an error requesting the categories')
		res.redirect('/admin')
	})
})

router.get('/categories/add', isAdmin, (req,res) => {
	res.render('admin/addcategories')
})

router.post('/categories/new', isAdmin, (req, res) => {

	//Validation:

	var errors = []

	if(!req.body.name || typeof req.body.name == undefined || req.body.name == null ){
		errors.push({text: 'Invalid name'})
	}

	if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
		errors.push({text: 'Invalid slug'})
	}

	//Tarefa pra dps: fazer validação de espaços e caracteres especiais

	if(req.body.name.length < 2){
		errors.push({text: "Invalid name. Try using a bigger category's name"})
	}

	if(errors.length > 0){
		res.render('admin/addcategories', {errors: errors})
	}else{
		const newCategory = {
		name: req.body.name,
		slug: req.body.slug
		}

		new Category(newCategory).save().then(() => {
			req.flash('success_msg', 'New category created!')
			res.redirect('/admin/categories')
		}).catch((err) => {
			req.flash('error_msg', 'There was an error registering the new category. Try again later')
			res.redirect('/admin')
		})
	}
	
})



router.get('/categories/edit/:id', isAdmin, (req, res) => {
	Category.findOne({_id: req.params.id}).lean().then((category => {
		res.render('admin/editcategories', {category: category})
	})).catch((err) => {
		req.flash('error_msg', 'This category does not exists')
		res.redirect('/admin/categories')
	})
})

router.post('/categories/edit', isAdmin, (req,res) => {
	Category.findOne({_id: req.body.id}).then((category) => {
		category.name = req.body.name
		category.slug = req.body.slug 

		category.save().then(() => {
			req.flash('success_msg', 'Category edited with success')
			res.redirect('/admin/categories')
		}).catch((err) => {
			req.flash('error_msg', "There was an error saving the category, try again later")
			res.redirect('/admin/categories')
		})
	}).catch((err) => {
		req.flash('error_msg', 'There was an error editing the category, try again later')
		res.redirect('/admin/categories')
	})
})


router.post('/categories/delete/:id', isAdmin, (req, res) => {
	Category.findOneAndDelete({_id: req.params.id}).then(() => {
		req.flash('success_msg', 'Category removed with success')
		res.redirect('/admin/categories')
	}).catch((err) => {
		req.flash('error_msg', 'There was an error removing the category. Try again later')
		res.redirect('/admin/categories')
	})
})


router.get('/posts', isAdmin, (req, res) => {
	Post.find().lean().populate('category').sort({date: 'desc'}).then((posts) => {
		res.render('admin/posts', {posts: posts})
	}).catch((err) => {
		req.flash('error_msg', 'There was an error showing your posts. Try again later')
	})
})


router.get('/posts/add', isAdmin, (req, res) => {
	Category.find().lean().then((categories) => {
		res.render('admin/addpost', {categories: categories})
	}).catch((err) => {
		req.flash('error_msg', 'There was an error loading the form. Try again later')
		res.redirect('/admin')
	})
})


router.post('/posts/new', isAdmin, (req, res) => {

	var errors = []

	if(req.body.categorie){
		errors.push({text: 'Invalid category!'})
	}

	if(errors.leght > 0){
		res.render('admin/categories', {errors: errors})
	}else{
		const newPost = {
			title: req.body.title,
			subtitle: req.body.subtitle,
			slug: req.body.slug,
			content: req.body.content,
			category: req.body.category
		}

		new Post(newPost).save().then(() => {
			req.flash('success_msg', 'Post created with success')
			res.redirect('/admin/posts')
		}).catch((err) => {
			req.flash('error_msg', 'There was an error while saving the post. Try again later')
			res.redirect('/admin/posts')
			console.log(err)
		})
	}

})


router.get('/posts/edit/:id', isAdmin, (req, res) => {
	Post.findOne({_id: req.params.id}).lean().then((post) => {
		Category.find().lean().then((categories) => {
			res.render('admin/editposts', {categories: categories, post: post})
		}).catch((err) => {
			req.flash('error_msg', 'There was an error loading the category. Try again later')
			res.redirect('/admin/posts')
		})
	}).catch((err)  => {
		req.flash('error_msg', 'There was an error while loading the form. Try again later')
	})
})


router.post('/posts/edit', isAdmin, (req, res) => {
	Post.findOne({_id: req.body.id}).then((post) => {
		post.title = req.body.title 
		post.slug = req.body.slug 
		post.subtitle = req.body.subtitle 
		post.content = req.body.content 
		post.category = req.body.category
		post.read_time = req.body.read_time

		post.save().then(() => {
			req.flash('success_msg', 'Your post has been edited with success')
			res.redirect('/admin/posts')
		}).catch((err) => {
			console.log(err)
			req.flash('error_msg', 'There was an error saving your edit. Try again later')
			res.redirect('/admin/posts')
		})
	}).catch((err) => {
		console.log(err)
		req.flash('error_msg', 'There was an error while saving the edit. Try again later')
		res.redirect('/admin/posts')
	})
})


router.post('/posts/delete/:id', isAdmin, (req, res) => {
	Post.findOneAndDelete({_id: req.params.id}).then(() => {
		req.flash('success_msg', 'Your post has been removed with success')
		res.redirect('/admin/posts')
	}).catch((err) => {
		req.flash('error_msg', 'There was an error removing the post. Try again later')
		res.redirect('/admin/posts')
	})
})




module.exports = router