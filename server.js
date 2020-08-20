const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const hbs = require('express-handlebars');
const nodemailer = require('nodemailer')

//config dependency for hiding password
require('dotenv').config();


const port = process.env.PORT || 3000;

const app = express()

// setting up bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//engine for handlebars
app.engine('handlebars',hbs())
app.set('view engine', 'handlebars')

//seting static folder
app.use(express.static(path.join(__dirname, 'public')))

app.post('/send', (request, response) => {

    sendingMail(request).catch(console.error);

    response.render('contact',{layout:false,callback:'Message has been sent'})
    //response.send(output);
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})

/**
 * 
 * @param {*} request
 */
async function sendingMail(request) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'testing', // sender address
        to: "pawel.jakub.wojcik@gmail.com", // list of receivers
        subject: "Mail wysłany przez nodeMailera", // Subject line
        html: createMessage(request.body), // html body
    });

    console.log(`email od ${request.body.name} ${request.body.surname} został wysłany na email: ${info.envelope.to}`);
}

let createMessage = ({ name, surname, email, message }) => `
    <h3>Contact details</h3>
    <ul>
        <li>Name : ${name}</li>
        <li>Surname : ${surname}</li>
        <li>email : ${email}</li>
    </ul>
        <h3>Wiadomość :</h3>
        <p>${message}</p>
    `;
