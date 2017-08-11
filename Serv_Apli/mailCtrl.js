/**
 * Created by Rodrigo de Miguel on 07/08/2017.
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
// email sender function
exports.sendEmail = function (req, res, callback = Function()) {

    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('rodrigo.trazas@gmail.com');
    var toEmail = new helper.Email('rodrigo.trazas@gmail.com');
    var subject = 'Registro adoptaUnAnimal prueba';
    var content = new helper.Content('text/HTML', "<html><body>Holaa Rodri,<br>" +
        "Esto es una prueba de email desde Heroku con texto escrito en <b>HTML</b>, " +
         "y esta es la foto de mi careto"+
            "<img align='center' src='public/images/neo.jpg' width='200' height='250'>"+
        "<img align='center' src='https://cv-rodrigodemiguel.herokuapp.com/images/rodri.jpg' width='200' height='250'></body></html>");
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        console.log('RESULTADO DEL ENVIO DE MAIL');
        if (error) {
            console.log('Error response received');
        }

        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);


        if(response.statusCode == 202){
            res.status(202).send('Email enviado https://mail.google.com/mail/u/0/#search/subject%3A(Registro+adoptaUnAnimal+prueba)');
        }
    });
};