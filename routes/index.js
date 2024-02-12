const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));



router.use('/students', require('./students'));
router.use('/user', require('./user'));

// login route
router.get('/login', passport.authenticate('github'), (req, res) => {});


// logout route
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/');
    })
   
})

module.exports = router;