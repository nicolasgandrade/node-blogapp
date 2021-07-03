const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema({
	name:{
		type: String,
		required: true,
		default: 'New Categorie'
	},
	slug:{
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
})


mongoose.model('categories', Category)