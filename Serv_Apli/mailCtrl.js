/**
 * Created by Rodrigo de Miguel on 07/08/2017.
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
// email sender function
exports.sendEmail = function (req, res, callback = Function()) {

    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('rodrigo.trazas@gmail.com');
    var toEmail = new helper.Email(req.params.email);
    var subject = 'Registro adoptaUnAnimal prueba';
    var content = new helper.Content('text/HTML', "<html><body>Holaa Tomyy,"+
    "<br> Esto es una prueba de email desde <img src='https://upload.wikimedia.org/wikipedia/commons/8/89/Logo_di_Heroku.png' width='150' height='50' " +
        "style='margin-bottom: -16px'> con texto escrito en <b>HTML</b> usando el Add-On <img src='https://avatars3.githubusercontent.com/u/181234?v=4&s=200' width='100' height='100' style='margin-bottom: -39px'>," +
    " ya se Kung Fu tomy, aunque hay que investigar más como fucniona esta platafoma, por que los estilos parece que no los carga bien"+
    "<br><br><img src='http://s2.quickmeme.com/img/f2/f22c50f29387e1461274eb73ae3a329e97e3aa09ac8dffee9218e017cd6c8b99.jpg' width='360' height='200' ></body></html>");
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
            res.status(202).send('Email enviado a ' + req.params.email);
        }
    });
};