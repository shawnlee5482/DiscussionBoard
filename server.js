// require express so that we can build an express app
var express = require('express');

// require path so that we can use path stuff like path.join
var path = require('path');

// instantiate the app
var app = express();

var morgan = require('morgan');

var secret = require('./server/config/secret.js');

var jwt = require('jsonwebtoken');

// include mongoose.js
require('./server/config/mongoose.js');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.set('superSecret', secret.secret);
app.use(morgan('dev'));

// set up a static file server that points to the "client" directory
app.use(express.static(path.join(__dirname, '/client')));

// this line requires and runs the code from our routes.js file and passes it app so that we can attach our routing rules to our express application!
require('./server/config/routes.js')(app);

/////////protected route starts from here ///////////////////
var apiRoutes = express.Router();

apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

// apply the routes to our application with the prefix /api
app.use('/dashboard', apiRoutes);

app.listen(8000, function() {
  console.log('listening on: 8000');
});