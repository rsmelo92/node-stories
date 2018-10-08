const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const app = express();
const passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//using ejs ....by setting its middleware..
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


//requiring keys..
const keys = require('./config/keys');

//loading user models....and schema...
 require('./models/user');

//connnecting to the database...
mongoose.connect(keys.mongoURL, {
	// useMongoClient: true
	useNewUrlParser: true
})
.then(()=>{
	console.log('connected to database');
})
.catch((err)=>{
	console.log(err);
});


//passport config..
require('./config/passport')(passport);

//loading routes
const auth = require('./routes/auth');
const index = require('./routes/index');


//FROM LINE "OTHER MIDDLEWARES " TO "USING ROUTES FOR AUTH SHOULLD BE BELOW ONLY"
//THN ONLY IT WILL WORK BECOZ THT AUTH ROUTES HAVE TO USE THOSE MIDDLE WARES...


//other midle wares...
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


//passport midddleware....
app.use(passport.initialize());
app.use(passport.session());

//SET GLOBAL VARIABLES....
app.use((req, res, next) =>{
	res.locals.user = req.user || null ;
	next();
});


//routes...FOR PAGE...GOEES BELOW
app.use('/', index);


//using  routes
app.use('/auth', auth);


port = process.env.PORT || 9000 ;

app.listen(port, (req, res)=>{
	console.log(`listening on port ${port}`);
});