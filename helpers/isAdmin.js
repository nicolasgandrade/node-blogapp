module.exports = {
    isAdmin: (req, res, next) => {

        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next()
        }else{
            req.flash('error_msg', 'You have not permission to enter here!')
            res.redirect('/')
        }

    }
}