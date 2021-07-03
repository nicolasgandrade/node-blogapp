const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
	title:{
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	subtitle: {
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	category:{
		type: Schema.Types.ObjectId, //armazena o id de uma categoria
		ref: 'categories',
		required: true
	},
	read_time: {
		type: String,
		required: false
	},
	date:{
		type: Date,
		default: Date.now()
	}
})

mongoose.model('posts', Post)