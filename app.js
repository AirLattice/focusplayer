// REQUIRE
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var OrientoStore = require('connect-oriento')(session);
var pug = require('pug');
// var bkfd2Password = require("pbkdf2-password");
// var hasher = bkfd2Password();
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.locals.pretty = true;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new OrientoStore({
    server:'host=45.119.145.162&port=2424&username=root&password=jin85200--&db=focus'
  })
}));
// app.use(cookieParser('234A!!@2$$21badfgpoi'));
// app.use(passport.initialize());
// app.use(passport.session());



//////////////////////////////////////////////////////////////////////
// DATA & USERS
var users = [
  {
    username: 'packman',
    password: 'b+aStUJunI59yeyhQe9CcgSN95d6fzHJRpYfZLEMHfy8MtDk2OZfDcD5GFjxakXSLbynbaOJ34ejMsqmcWz5WZEUlJMvYdZgpndtkIIXkkCScXd18hPBE1a0DN/WuHkSfXhMcX9DskcVq9bBFxLgiKeEe67PuOoTkrxyXE0Uvdo=',
    salt: '3AjJmjU2e161MdpvvsO9YPIOllCr1jS7NTlZ66U4YvXkf8xZZRwXVhAV6YDur4Xlj2522H3MJAtljZHe0MbQcw==',
    displayName: 'PACKMAN'
  }
];
var user = {
  username: 'packman',
  password: '111',
  displayName: 'PACKMAN'
};
var db = require('./config/orientdb')(app);

/*
function check(req, res, session){
  if(req.session.displayName){
    res.send(req.session.displayName);
    var dispname = req.session.displayName;
    return dispname;
  } 
};
*/

//////////////////////////////////////////////////////////////////////
// ROUTERS
app.get('/check', function(req, res){
  if(req.session.displayName){
    res.send(req.session.displayName);
  } else {
    res.send('You are not have session');
  }
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/');
});
app.post('/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO list (title, description, author) VALUES(:title, :desc, :author)';
  db.query(sql, {
    params:{
      title:title,
      desc:description,
      author:author
    }
  }).then(function(results){
      res.redirect('/list');
  });
});
app.get('/add', function(req, res){
  res.render('add');
});
//////////////////////////////////////////////////////////////////////////////
app.post('/auth/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var displayName = req.body.displayName;
  var sql = 'INSERT INTO users (id, pwd, nick) VALUES(:username, :password, :displayName)';
  db.query(sql, {
    params:{
      username:username,
      password:password,
      displayName:displayName
    }
  }).then(function(results){
    req.session.displayName = displayName;
    req.session.save(function(){
      res.redirect('/');
    });
  });
});
app.get('/auth/register', function(req, res){
  res.render('register');
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/');
});
app.get('/welcome', function(req, res){
  if(req.session.displayName){
     var dispname = req.session.displayName;
     res.render('welcome', { dpname: dispname});
  }
});
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  var sql = 'SELECT * FROM users';
  db.query(sql).then(function(results){
    for(var i=0; i<results.length; i++){
      var user = results[i];
      if(uname === user.id && pwd === user.pwd){
        req.session.displayName = user.nick;
        return req.session.save(function(){
          res.redirect('/welcome');
        });
      }
    }
    res.redirect('/welcome');
  });
});
app.get('/auth/login', function(req, res){
  res.render('login');
});
app.get('/list', function(req, res){
  var sql = 'SELECT FROM list'
  db.query(sql).then(function(list){
    res.render('list', {lists:list});
  });
});
app.get('/auth/register', function(req, res){
  res.render('register')
})
app.get('/page1', function(req, res){
  res.render('page1')
})
app.get('/page2', function(req, res){
  res.render('page2')
})
app.get('/', function(req, res){
  res.render('main');
});



//////////////////////////////////////////////////////////////////////
// WEB_SERVER LISTEN
app.listen(3000, function(){
        console.log('Conneted 3000');
});
