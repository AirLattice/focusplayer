var express = require('express');
var app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;


app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('main')
})



app.listen(3000, function(){
        console.log('Conneted 3000');
});
