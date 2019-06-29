const express = require('express')
const app = express.Router()
const connection = require('./connection')
var changeInfoSuccess = false;
var changeAvaSuccess;

app.get('/profile', function (req, res) {
    connection.query(`SELECT *, date_format(b.NgayDatMua, '%d/%m/%Y') as date, format(b.TongTien, 0) as money FROM CHITIETSANPHAM a, DONHANG b WHERE a.ID_SANPHAM=b.ID_SP and a.ID_CTSANPHAM=b.ID_CTSP and a.HangSanXuat=b.HSX and SDT_KhachHang = ?`, [req.session.user.PHONE], function (error, result) {
        if (!!error) {
            console.log('Error querying!');
            res.render('pages/profile.ejs',
                {
                    isSuccess: req.session.isLogged,
                    user: req.session.user,
                    gender: req.session.gender,
                    changeInfo: changeInfoSuccess,
                    changeAva: changeAvaSuccess,
                    avaValue: req.session.avaValue,
                    orderHistory: req.session.orderHistory
                });
        } else {
            req.session.orderHistory = result;
            res.render('pages/profile.ejs',
                {
                    isSuccess: req.session.isLogged,
                    user: req.session.user,
                    gender: req.session.gender,
                    changeInfo: changeInfoSuccess,
                    changeAva: changeAvaSuccess,
                    avaValue: req.session.avaValue,
                    orderHistory: req.session.orderHistory
                });
        }
    })
    changeInfoSuccess = false;
    changeAvaSuccess = undefined;
})

app.get('/profile/logout', function (req, res) {
    req.session.isLogged = 0;
    req.session.user = null;
    req.session.orderHistory = null;
    res.redirect('/');
});

app.post('/profile/personal-information', function (req, res) {
    connection.query('UPDATE KHACHHANG SET NAME = ?, PHONE = ?, EMAIL = ?,  GENDER = ?, ADDRESS = ?  WHERE ID = ?', [req.body.name, req.body.phone, req.body.mail, req.body.gender, req.body.address, req.session.user.ID], function (error, result) {
        if (!!error) {
            console.log('Error querying!');
        } else {
            connection.query('SELECT * FROM KHACHHANG WHERE ID = ?', [req.session.user.ID], function (error, result) {
                if (!!error) {
                    console.log('Error querying!');
                } else {
                    req.session.user = result[0];
                    if (req.session.user.GENDER === "Nam") {
                        req.session.gender = 0;
                    }
                    else {
                        req.session.gender = 1;
                    }
                    changeInfoSuccess = true;
                    res.redirect('/profile');
                }
            });
        }
    })
});

app.post('/profile/change-password', function (req, res) {
    if (req.body.old === req.session.user.PASSWORD) {
        connection.query('UPDATE KHACHHANG SET PASSWORD = ? WHERE ID = ?', [req.body.new, req.session.user.ID], function (error, result) {
            if (!!error) {
                console.log('Error querying!');
            } else {
                connection.query('SELECT * FROM KHACHHANG WHERE ID = ?', [req.session.user.ID], function (error, result) {
                    if (!!error) {
                        console.log('Error querying!');
                    } else {
                        req.session.user = result[0];
                        res.send("Success");
                    }
                })
            }
        })
    }
    else {
        res.send("Fail");
    }
});

app.get('/profile/order-history', function (req, res) {
    connection.query(`SELECT *, date_format(b.NgayDatMua, '%d/%m/%Y') as date, format(b.TongTien, 0) as money FROM CHITIETSANPHAM a, DONHANG b WHERE a.ID_SANPHAM=b.ID_SP and a.ID_CTSANPHAM=b.ID_CTSP and a.HangSanXuat=b.HSX and SDT_KhachHang = ?`, [req.session.user.PHONE], function (error, result) {
        if (!!error) {
            console.log('Error querying!');
        } else {
            req.session.orderHistory = result;
            res.send(result);
        }
    })
});

app.post('/profile/change-avatar', function (req, res) {
    if (req.body.gCavatar != null) {
        changeAvaSuccess = true;
        connection.query('UPDATE KHACHHANG SET AVATAR = ? WHERE ID = ?', [req.body.gCavatar, req.session.user.ID], function (error, result) {
            if (!!error) {
                console.log('Error querying!');
            } else {
                connection.query('SELECT * FROM KHACHHANG WHERE ID = ?', [req.session.user.ID], function (error, result) {
                    if (!!error) {
                        console.log('Error querying!');
                    } else {
                        req.session.user = result[0];
                        console.log(req.session.user);
                        req.session.avaValue = req.body.gCavatar;
                        res.redirect('/profile');
                    }
                })
            }
        });
    }
    else {
        changeAvaSuccess = false;
        connection.query(`UPDATE KHACHHANG SET AVATAR = '/img/avatar/default.png' WHERE ID = ?`, [req.session.user.ID], function (error, result) {
            if (!!error) {
                console.log('Error querying!');
            } else {
                connection.query('SELECT * FROM KHACHHANG WHERE ID = ?', [req.session.user.ID], function (error, result) {
                    if (!!error) {
                        console.log('Error querying!');
                    } else {
                        req.session.user = result[0];
                        console.log(req.session.user);
                        req.session.avaValue = undefined;
                        res.redirect('/profile');
                    }
                })
            }
        });
    }
});

module.exports = app
