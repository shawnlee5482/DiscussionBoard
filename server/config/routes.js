'use strict';

var topics = require('./../controllers/topics.js');
var users = require('./../controllers/users.js');

// This is our routes.js file located in server/config/routes.js
// This is where we will define all of our routing rules!
// We will have to require this in the server.js file (and pass it app!)
module.exports = function(app) {

  // Topics
  app.get('/topic/:id', topics.detailInfo);

  app.post('/topic/:id', topics.addPost);

  app.get('/post/:id/up', topics.up);

  app.get('/post/:id/down', topics.down);

  app.post('/post/:id', topics.addComment);

  app.get('/topics', topics.index);

  app.post('/topics', topics.create);

  // TODO: User routes should be in their own file
  app.get('/signup', users.dummyCreate);

  app.post('/login', users.login);

  app.post('/users/check_duplicate', users.check_duplicate);

  app.post('/users', users.create);

  app.get('/user/:id', users.get);
};