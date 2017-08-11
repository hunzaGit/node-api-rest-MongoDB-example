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
    var subject = 'Hola rodriii prueba HTML';
    var content = new helper.Content('text/HTML', "<html><body>Holaa,\n prueba de email desde Heroku con texto en <b>HTML</b></body></html>");
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
            res.status(202).send('Email enviado');
        }
    });
};