const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverrride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Initializations, Iniciamos express y base datos
const app = express();
require('./database');
require('./config/passport');

// Settings Aqui aqui se configuran los archivos de plantilla, su extension, path etc...
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverrride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true, 
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; 
 
    next();
});
 
// Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/notes.js'));
app.use(require('./routes/users.js'));

//Statics Files
app.use(express.static(path.join(__dirname, '/public')));
 
//Server is Listenning
app.listen(app.get('port'), ()=>{
    console.log("Server on port" + app.get('port'))
});