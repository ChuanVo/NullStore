const express = require('express')
const body = require('body-parser')
const app = express.Router()
const fs = require('fs')
const connection = require('./connection.js')
var fullFill = 0;

app.get('/contact', function (req, res) {
    res.render('pages/contact.ejs', { isSuccess: req.session.isLogged, user: req.session.user, fullfill: fullFill, avaValue: req.session.avaValue });
    fullFill = 0;
})

app.use(body.json())
app.use(body.urlencoded({ extended: true }))

app.post('/contact/submit-user-info', function (req, res) {
    console.log(req.body);
    if (req.body.name === '' || req.body.phone === '' || req.body.detail === '') {
        fullFill = 1;
        res.redirect('/contact');
    }
    else {
        if (req.body.help === null) {
            var help = '';
        } else if (Array.isArray(req.body.help)) {
            var help = req.body.help.join();
        } else {
            var help = req.body.help;
        }
        fullFill = 2;
        res.redirect('/contact');
        connection.query('INSERT INTO TROGIUP(name, phone, details, requirements) VALUES (?, ?, ?, ?)', [req.body.name, req.body.phone, req.body.detail, help], function (error) {
            if (!!error) {
                console.log('Error!');
                console.log(error);
            } else {
                console.log('SUCCESS!');
            }
        });
    }
});


module.exports = app

