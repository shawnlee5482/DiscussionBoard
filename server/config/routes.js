  // This is our routes.js file located in server/config/routes.js
  // This is where we will define all of our routing rules!
  // We will have to require this in the server.js file (and pass it app!)
  module.exports = function(app) {
  	// First, at the top of your routes.js file you'll have to require the controller
    var topics = require('./../controllers/topics.js');

    // Topics
    app.get('/topic/:id', function(req, res) {
      topics.detailInfo(req, res);
    });

    app.post('/topic/:id', function(req, res) {
      topics.addPost(req, res);
    });

    app.get('/post/:id/up', function(req, res) {
      topics.up(req, res);
    });

    app.get('/post/:id/down', function(req, res) {
      topics.down(req, res);
    });

    app.post('/post/:id', function(req, res) {
      topics.addComment(req, res);
    });

    app.get('/topics', function(req, res) {     
      topics.index(req, res);
    }); 

    app.post('/topics', function(req, res) { 
      console.log('app.post', req.body.category, req.body.topic, req.body._user, req.body.description);    
      topics.create(req, res);
    }); 

    // First, at the top of your routes.js file you'll have to require the controller
    var users = require('./../controllers/users.js');

    // temporary code
    app.get('/signup',function(req, res) {
      users.dummyCreate(req,res);
    });

    app.post('/login',function(req, res) {
      try {
        users.login(req, res, app);
      } catch (e) {
        res.json({success: false, message: e});
      }
    });

    app.post('/users/check_duplicate', function(req, res) {
      users.check_duplicate(req, res);
    });

    app.post('/users', function(req, res) {
      users.create(req, res);
    });

    app.get('/user/:id', function(req, res) {
      users.get(req, res);
    });
};