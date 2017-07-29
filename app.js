var express = require("express"),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose = require('mongoose'),
    morgan = require("morgan"); //Morgan nos muestra las peticiones por consola.




// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan("dev"));

// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
    res.send("Hello world!");
});
app.use(router);

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
    .get(TVShowCtrl.findAllTVShows)
    .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshow/:id')
    .get(TVShowCtrl.findById)
    .put(TVShowCtrl.updateTVShow)
    .delete(TVShowCtrl.deleteTVShow);

app.use('/api', tvshows);






var uri = 'mongodb://hunza:1234@ds127153.mlab.com:27153/tvshows';
var uriHeroku = 'mongodb://hunza:1234@ds129333.mlab.com:29333/heroku_bk3g2c0p';



var options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    auth: {role: 'admin'}
};

mongoose.connect(uriHeroku, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'ERROR de conexion a Mongo: '));

db.once('open', () => {
    console.log("CONECTADOOOO A MONGOO!!!!");

    app.set('port', (process.env.PORT || 5000));

    app.listen(app.get('port'), () => {
        console.log("Servidor arrancado en puerto 5000");

    });
});









function pruebaMetodos() {


    var kittySchema = mongoose.Schema({
        name: String
    });


    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    }

    var KittenModel = mongoose.model('Kitten', kittySchema);

    var silence = new KittenModel({name: 'Silence'});
    //console.log(silence.name); // 'Silence'

    //silence.speak();
    var fluffy = new KittenModel({name: 'otro gato mas'});
    //fluffy.speak(); // "Meow name is fluffy"

    /*
     fluffy.save(function (err, fluffy) {
     if (err) return console.error(err);
     fluffy.speak();
     });*/

    fluffy.name = 'nombre cambiado';

    fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
    });


    KittenModel.find({}, function (err, res) {

        if (err) console.log('ERROR: ' + err);
        console.log(res);
    });
}


