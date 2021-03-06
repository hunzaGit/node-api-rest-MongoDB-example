/* global __dirname */

var express = require("express"),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'),
    encrypt = require('mongoose-encryption'),
    morgan = require("morgan"), //Morgan nos muestra las peticiones por consola.
    fs = require('fs'),
    path = require('path'),
    config = require('./config')('dev');


// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan("dev"));



app.disable('X-Powered-By');

//Configuración para ficheros estáticos.
var ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));













// Import Models and controllers
var models = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./Serv_Apli/tvshows');


// API routes
var tvshows = express.Router();
/*
 tvshows.route('/tvshows')
 .get(TVShowCtrl.findAllTVShows)
 .post(TVShowCtrl.addTVShow);

 tvshows.route('/tvshow/:id')
 .get(TVShowCtrl.findById)
 .put(TVShowCtrl.updateTVShow)
 .delete(TVShowCtrl.deleteTVShow);



 app.use('/api', tvshows);

 */











/**
 * Created by Rodrigo de Miguel on 02/08/2017.
 */


//***************************************************
//***************************************************
//            PRUEBA EXTENDS SCHEMA
//***************************************************
//***************************************************


/*
 const extendSchema = require('mongoose-extend-schema');

 const UserSchema = new mongoose.Schema({
 firstname: {type: String},
 lastname: {type: String}
 });

 const ClientSchema = extendSchema(UserSchema, {
 phone: {type: String, required: true}
 });

 */




//Source code********************************

//const mongoose = require('mongoose');

function extendSchema(Schema, definition, options) {
    return new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    );
}


//Example***************************************

//const mongoose = require('mongoose');
//const extendSchema = require('mongoose-extend-schema');

const UserSchema = new mongoose.Schema({
    email: {type: String},
    passwordHash: {type: String},

    firstname: {type: String},
    lastname: {type: String},
    phone: {type: String},

    tamaño: {type: String}
});

// Extend UserSchema
const AdminUserSchema = extendSchema(UserSchema, {
    firstname: {type: String},
    lastname: {type: String},
    phone: {type: String},

    sexo: {type: String},
    edad: {type: String}
});




//Configuracion de encriptacion de password
var encKey = process.env.ENCRYPTATION_KEY;
var sigKey = process.env.SIGNING_KEY;
// encrypt age regardless of any other options. name and _id will be left unencrypted
AdminUserSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['passwordHash'] });

const UserModel = mongoose.model('users', UserSchema);
const AdminUserModel = mongoose.model('admins', AdminUserSchema);


//***************************************************
//            CONEXION A BBDD MOGNODB
//***************************************************


// Example Route
var router = express.Router();


router.get('/', function(req, res) {
    res.send("Hello world! " + config.uri);
});


router.get('/break', function(req, res) {
    throw new Error('oh no!');
});

router.get('/loaderio-ff50c14950f9695428b614d8da4b41fc.txt', function(req, res) {
    fs.readFile('loaderio-ff50c14950f9695428b614d8da4b41fc.txt', (err, buffer)=> {
        "use strict";
        if(err) console.error(err);
        res.send(buffer)
    });
});


router.get('/saveUser', function (req, res) {
    const john = new UserModel({
        email: 'user2@site.com',
        passwordHash: 'bla-bla-bla',
        firstname: 'John',
        tamaño: 'M'
    });

    john.save((err, john) => {
        "use strict";
        if (err) return res.send(500, err.message)
        else res.send('user guardado');
    });


});


router.get('/saveAdmin', function (req, res) {
    const admin = new AdminUserModel({
        email: 'admin7@site.com',
        passwordHash: 'bla-bla-bla',
        firstname: 'Henry',
        sexo: 'M',
        tamaño: 'G',


        lastname: 'Hardcore',
        phone: '+555-5555-55'
    });

    admin.save((err, admin) => {
        "use strict";
        if (err) return res.send(500, err.message);
        else res.send('admin guardado');

    });
// Oops! Error 'phone' is required

});

router.post('/saveWithPass', function (req, res) {

    console.log(req.body.password);
        const admin = new AdminUserModel({
            email: req.body.email,
            passwordHash: req.body.password
        });

        admin.save((err, admin) => {
            "use strict";
            if (err) return res.status(500).send(err.message);
            else res.status(201).send(admin);
        });

});

router.post('/login', function (req, res) {

    AdminUserModel.findOne({email:req.body.email}, (err, user) => {
        "use strict";
        if (err) res.status(500).jsonp(err);
            // result == true
            console.log(user.passwordHash)
            console.log(req.body.password)

            if(user.passwordHash === req.body.password){
                console.log('password correcta');
                res.status(202).jsonp(user);
            }else{
                res.status(401).jsonp(result);
            }


        })


});


var params = {
    sex: ['M', 'H'],
    tam: ['MP', 'P', 'M', 'G', 'MG'],
    edad: ['C', 'J', 'A', 'MA', 'M', 'AB']
};


function getParams(req, res, next) {
    var query = req.query;

    Object.keys(params).forEach((elem) => {
        "use strict";
        query[elem] = (query[elem]) ? query[elem].split(',') : params[elem];
    });

    //console.log(query);

    req.query = query;
    next();
}


router.get('/get/:tipo/:num/:pag', getParams, function (req, res) {
    var modelo;

    AdminUserModel.find({
        sexo: {$in: req.query.sex},
        tamaño: {$in: req.query.tam},
        edad: {$in: req.query.edad}
    },{sexo:1,tamaño:1,edad:1}, (err, users) => {
        "use strict";
        if (err) console.error(err);
        res.status(200).jsonp(users);
    })
        .limit(Number(req.params.num)).skip(req.params.pag * req.params.num);


});


router.get('/get/:id', getParams, function (req, res) {

    AdminUserModel.findById(req.params.id, (err, user) => {
        "use strict";
        if (err) console.error(err);
        res.status(200).jsonp(user);
    });
    
});



router.put('/put/:id', function (req, res) {

    AdminUserModel.findById(req.params.id, (err, user) => {
        "use strict";
        if (err) console.error(err);
        if(err) return res.status(500).send(err);
        console.log(user.email);

        user.validada = true;
        user.save((err, user)=>{
            if (err) console.error(err);
            if(err) return res.status(500).send(err);
            console.log(user);
            res.status(200).jsonp(user);
        });
    });

});



router.get('/getOne', function (req, res) {
    AdminUserModel.find((err, users) => {
        "use strict";
        if (err) console.error(err);
        res.status(200).jsonp(users);
    })
        .limit(1).skip(Math.floor(Math.random() * (100 - 0)) + 0);
});




var EmailCtrl = require('./Serv_Apli/ControladorEmail');

router.get('/enviarMail/:email', EmailCtrl.sendEmail);




router.post('/rellenaBD/:num', function (req, res) {

    cont = 0;
    for (var i = 0; i < req.params.num; i++) {
        var x = Math.floor(Math.random() * (1 - 0)) + 0;
        //console.log(x);
        var y = Math.floor(Math.random() * (4 - 0)) + 0;
        //console.log(y);
        var z = Math.floor(Math.random() * (5 - 0)) + 0;
        //console.log(z);

        new AdminUserModel({
            sexo: params.sex[x],
            tamaño: params.tam[y],
            edad: params.edad[z]

        }).save().then((user) => {
            console.log(user._id);
            cont++;
            if (err) console.log(err);

        });

    }

    res.send(cont + ' inserts')

});





app.use(router);


mongoose.connect(config.uri, config.options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'ERROR de conexión a Mongo: '));

db.once('open', () => {
    console.log("CONECTADOOOO A MONGOO!!!!");

    app.listen(config.port, () => {
        console.log("Servidor arrancado en puerto " + config.port);
        console.log(config.uri);
    });
});

