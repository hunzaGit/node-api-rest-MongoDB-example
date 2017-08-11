/**
 * Created by Rodrigo de Miguel on 07/08/2017.
 */
var config = require('../config.js')('dev');

// email sender function
exports.sendEmail = function (req, res, callback = Function()) {

    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('rodrigo.trazas@gmail.com');
    var toEmail = new helper.Email(req.params.email);
    var subject = 'Registro adoptaUnAnimal prueba';


    require('fs').readFile('resources/correo.html', "utf8", (err, bufferHTML)=> {
        if(err) console.error(err);


        var content = new helper.Content('text/HTML', bufferHTML);
        var mail = new helper.Mail(fromEmail, subject, toEmail, content);

        var sg = require('sendgrid')(config.EMAIL_API);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
            console.log('RESULTADO DEL ENVIO DE MAIL: ' + response.statusCode);

            if (error) {
                console.log('Error response received');
                console.log(error);
                res.status(400).send('Email NO enviado a ' + req.params.email + '\n<br>' + bufferHTML);
            }

            //console.log(response.statusCode);
            //console.log(response.body);
            //console.log(response.headers);

            if(response.statusCode === 202){
                res.status(202).send('Email enviado a ' + req.params.email + '\n<br>' + bufferHTML);
            }
        });
    });

};