const express = require('express')
const app = express.Router()
const connection = require('./connection')
var IsExist = false;

app.get('/register', function(req, res) {
    res.render('pages/register.ejs', {isExist: IsExist, isSuccess: req.session.isLogged, user: req.session.user, avaValue: req.session.avaValue });
    IsExist = false;
});

app.post('/register/register-account', function (req, res) {
    connection.query('SELECT * FROM KHACHHANG WHERE PHONE = ?', [req.body.phone], function (error, result) {
        if (!!error) {
            console.log('Error querying!');
            res.send("<h3>Error querying!</h3><button><a href='/'>Home</a></button>");
        } else {
            if(result[0] === undefined) {
                connection.query('INSERT INTO KHACHHANG(PHONE, PASSWORD, NAME, EMAIL) VALUES (?, ?, ?, ?)', [req.body.phone, req.body.password, req.body.name, req.body.mail], function(error, rows) {
                    if (!!error) {
                        console.log('Error querying! (Adding account)');
                        console.log(error);
                    } else {
                        console.log(rows);
                    }
                });
                res.redirect('/login');
            }
            else {
                IsExist = true;
                res.redirect('/register');
            }
        }
    });
});

module.exports = app