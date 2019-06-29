const express = require('express')
const app = express.Router()
const connection = require('./connection')

app.get('/login', function(req, res) {
    res.render('pages/login.ejs', {isSuccess: req.session.isLogged, user: req.session.user, avaValue: req.session.avaValue })
})

app.post('/login/login-confirm', function (req, res){
    connection.query('SELECT * FROM KHACHHANG WHERE PHONE = ? AND PASSWORD = ?', [req.body.phone, req.body.password], function (error, result) {
        if (!!error) {
            console.log('Error querying!');
            res.send("<h3>Error querying!</h3><button><a href='/'>Home</a></button>");
        } else {
            if(result[0] === undefined) {
                req.session.isLogged = 2;
                res.redirect('/login');
            }
            else {
                req.session.isLogged = 1;
                req.session.user = result[0];
                res.redirect('/');
            }
        }
    });
});

module.exports = app

