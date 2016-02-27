var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect('mongodb://siker:r5o0o0t6@ds061355.mlab.com:61355/ezmoney',function (err,database) {
  if (err) {
    throw err;
  }else{
  	db = database;
  }
})


var crypto = require('crypto');
 function hashPW(pwd){
   return crypto.createHash('sha256').update(pwd).
          digest('base64').toString();
 }



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/algo',function (req,res,next) {
	res.send(req.param("userid"));
});

router.get('/algo/:uuid',function (req,res,next) {
	res.send(req.param("uuid"));
});

router.get('/json', function (req, res,next) {

   	res.json({name:"Smithsonian",built:'1846',items:'137M',centers: ['art', 'astrophysics', 'natural history','planetary', 'biology', 'space', 'zoo']});
 });


router.get('/restricted', function(req, res,next){
   if (req.session.user) {
     res.send('<h2>'+ req.session.success + '</h2>' +
              '<p>You have entered the restricted section<p><br>' +
              ' <a href="/logout">logout</a>');
   } else {
     req.session.error = 'Access denied!';
     res.redirect('/login');
   }
 });

router.get('/logout', function(req, res,next){
   req.session.destroy(function(){
     res.redirect('/login');
   });
 });

router.get('/login', function(req, res,next){
   var response = '<form method="POST">' +
     'Username: <input type="text" name="username"><br>' +
     'Password: <input type="password" name="password"><br>' +
     '<input type="submit" value="Submit"></form>';
	if(req.session.user){
     res.redirect('/restricted');
   }else if(req.session.error){
     response +='<h2>' + req.session.error + '<h2>';
   }
   res.type('html');
   res.send(response);
 });

router.post('/login', function(req, res,next){
   //user should be a lookup of req.body.username in database
   var user = {name:req.body.username, password:hashPW("myPass")};
   if (user.password === hashPW(req.body.password.toString())) {
     req.session.regenerate(function(){
       req.session.user = user;
       req.session.success = 'Authenticated as ' + user.name;
       res.redirect('/restricted');
     });
   } else {
     req.session.regenerate(function(){
       req.session.error = 'Authentication failed.';
       res.redirect('/restricted');
     });
     res.redirect('/login');
   }
 });


router.get('/addObject',function (req,res,next) {
	var response = '<form method="POST">' +
     'Animal: <input type="text" name="animal"><br>' +
     'Nombre: <input type="text" name="nombre"><br>' +
     '<input type="submit" value="Submit"></form>';
	res.type('html');
    res.send(response);
})

router.post('/addObject',function (req,res,next) {
	var animal = {animal: req.body.animal, nombre:req.body.nombre};

	console.log("Post add object "+animal.animal);
	res.redirect('/addObject');
})

module.exports = router;
