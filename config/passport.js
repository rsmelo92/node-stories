const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const passport = require('passport');

//load user modelss....
const User = mongoose.model('users');

module.exports = function(passport){
	passport.use(
		new GoogleStrategy({
			clientID: keys.googleClientID ,
    		clientSecret: keys.googleClientSecret,
    		callbackURL: "/auth/google/callback",
    		// THIS PROXY IS REQUIRED FOR THE ONLINE SERVERS BECOZ THEY LOAD EITH THE https:// methds.. 
    		proxy : true
		}, (accessToken, refreshToken, profile, done)=>{
			// console.log(profile);

			const image = profile.photos[0].value.substring(0, 
				profile.photos[0].value.indexOf('?'));
			// console.log(image);

			//this is what will go in our database....
			const newUser = {
				googleID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[0].value,
				image: image
			}

			//check for the existing users...
			User.findOne({
				googleID : profile.id
			}).then(user =>{
				if(user){
					//return user..
					done(null, user);
				}else{
					//create user..
					new User(newUser)
					  .save()
					  .then(user => done( null, user));
				}
			})
		})
	);

	passport.serializeUser((user, done) => {
  		done(null, user.id);
	});

	passport.deserializeUser((user, done) => {
  		User.findById(id).then(user => done(null, user));
	});
}