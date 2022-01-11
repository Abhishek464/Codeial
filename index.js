const express=require('express');
const env=require('./config/environment');
// const cookie=require('cookie-parser');
const cookieParser = require('cookie-parser');
const app=express();
const port=8000;
const db=require('./config/mongoose');
// used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./controllers/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

// set up the chat server to be used with socket.io
const chatserver=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatserver);
chatserver.listen(5000);

console.log('chat server is listening on port 5000');
const path=require('path');

if(env.name=='development'){
app.use(sassMiddleware({
    src:path.join(__dirname,env.asset_path,'scss'),
    dest:path.join(__dirname,env.asset_path,'css'),
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))
}



app.use(express.urlencoded({
    extended:false
}));
// app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));

app.use('/uploads',express.static(__dirname +'/uploads'));
// make the uploads path available to the browser

// Use Express Router
// app.use('/',require('./routes'));
// Set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// Mongo Store is used to store the session cookie in db
app.use(session({
    name:'codeial',
    //ToDo change the secret before deployment in production mode
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*10)
    },
    store: MongoStore.create(
        {
          mongoUrl: 'mongodb://localhost/codeial_development',
          autoRemove: "disabled",
        },
        
    function(err){
        if(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
if(err){
    console.log(`Error in running the server:${err}`);
}
console.log(`Server is running on port: ${port}`);
});

