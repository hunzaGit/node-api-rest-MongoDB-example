


//******************************************
//          CONFIGURACIÓN BBDD
//******************************************

var host= "ds127153.mlab.com";
var port_BD='27153';
var usuario= "hunza";
var password= "1234";
var nombreBD= "tvshows";



module.exports = {
   	port : process.env.PORT || 5000,

	uri : process.env.MONGODB_URI || process.env.MONGODB_URI_DEV,//('mongodb://'+usuario+':'+password+'@'+host+':'+port_BD+'/'+nombreBD),
    options: {
        server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
        replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
        auth: {role: 'admin'}
    },

    private_key: "./practica2_clave_privada.pem",
    certificate: "./practica2_certificado_firmado.crt"
};
