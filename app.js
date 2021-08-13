var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var session = require('express-session');
const mongoose = require('mongoose');
var app = express();

const maxAge = 1000 * 60 * 60;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get('secret-key'),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge : maxAge }
}));

// engine ejs 
app.set('views', __dirname + '/apps/views');
app.set('view engine', 'ejs');
// static folder
app.use('/public', express.static(__dirname + '/public'));
var controllers = require(__dirname + '/apps/controllers');
app.use(controllers);

mongoose.connect(
    process.env.MONGODB_URI || config.get('mongodb.urlConnect'),
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected !!!");
});

let host = config.get('server.host');

let port = config.get('server.port');

var server = app.listen(process.env.PORT || port, host, () => {
    console.log('Server running port', port);
});

var io = socketIo(server);

var socketControl = require('./apps/common/socketControl')(io);

