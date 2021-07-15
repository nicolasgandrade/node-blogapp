# NodeJs BlogApp
## 💚 Blog App created with NodeJS and MongoDB

<!-- <h4 align="center"> 
	🚧  NodeJs BlogApp - Under development...  🚧
</h4> -->

### Features
- [x] Everybody is able to read posts
- [x] Categories filter
- [x] Register new user and admin account
- [x] Login into your account
- [x] Hashed passwords
- [x] Admin options: Create, edit and remove posts and categories 
- [x] Logout system

### Requirements

Before running the application, you must have NodeJs and MongoDB installed. 
Make sure the mongo server is up before starting.

### 🎲 Running the Server

You can run the app using node command:
````node app.js````

The blog is hosted on localhost port 8081 (localhost:8081).

Note: The database in MongoDB will be created automatically after the application starts.

### Main Routes
<!--ts-->
   * /
   * /users/register 
   * /users/login
   * /categories
   * /admin
   * /admin/categories
   * /admin/posts
<!--te-->

If you want to register an admin user, you need to change the code inside *routes/user.js* **from this:**
````
const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
````
**to this**
````
const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
		    isAdmin: 1
                })
````
(lines 63/64 *routes/user.js*)
and then, reload the app and **register the new admin user.**

### 💻 Technologies

The following tools were used in the construction of the project:

- NodeJs
- Express
- Handlebars
- MongoDB
- Bootstrap

### Author
---

 <img style="border-radius: 50%;" src="https://github.com/nicolasgandrade.png" width="100px;" alt=""/>

Made by Nicolas Guerrero 👋🏽 
