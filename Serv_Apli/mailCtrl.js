/**
 * Created by Rodrigo de Miguel on 07/08/2017.
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
// email sender function
exports.sendEmail = function (req, res, callback = Function()) {


    console.log('preparando email...');
    console.log(process.env.PASS_MAIL);

    // Definimos el transporter
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'rodrigo.trazas@gmail.com',
            pass: process.env.PASS_MAIL
        }
    }));

    console.log('ESCRIBIENDO CORREO...');
    // Definimos el email
    var mailOptions = {
        from: 'rodrigo.trazas@gmail.com',
        to: 'rodrigo.trazas@gmail.com',
        subject: 'prueba de correo',
        text: 'Prueba de correo desde Heroku'
    };


    console.log('ENVIANDO EMAIL...');
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send(error.message);
        } else {
            console.log("EMAIL SENT");
            console.info(info)
            res.status(200).send('EMAIL ENVIADO');
        }
    });
};