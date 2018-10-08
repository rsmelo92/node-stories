const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('./auth')


router.get('/', (req, res)=>{
	// console.log(req.user); 
	res.render('index/welcome');
});

router.get('/dashboard', (req, res)=>{
	console.log(req.user);
	res.send ('dashboard');

});

module.exports = router;