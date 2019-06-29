const express = require('express')
const connection = require('./connection.js')
const axios = require('axios')
const admin = express.Router()
const body = require('body-parser')

admin.use(body.json())
admin.use(body.urlencoded({ extended: true }))

// Admin page
admin.get('/admin', function (req, res) {
    var users;
    var products;
    var helps;
    var orders;
    if (req.session.adminLogged === false || req.session.adminLogged === undefined) {
        res.redirect('/admin/login');
    } else {
        axios.get('http://nullstore.herokuapp.com/admin/all-users')
            .then(function (respond) {
                users = respond.data;
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {

                axios.get('http://nullstore.herokuapp.com/admin/all-products')
                    .then(function (respond) {
                        products = respond.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {

                        axios.get('http://nullstore.herokuapp.com/admin/all-helps')
                            .then(function (respond) {
                                helps = respond.data;
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                            .then(function () {
                                axios.get('http://nullstore.herokuapp.com/admin/allOrders')
                                    .then(function (response) {
                                        orders = response.data;
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    })
                                    .then(function () {
                                        res.render('pages/admin.ejs', { user: users, product: products, help: helps, order: orders });
                                    });
                            });
                    });
            });
    }
});

admin.get('/admin/logincheck', function (req, res) {
    req.session.adminLogged = false;
    res.redirect('/admin/login');
});

// Admin login - Login before entering Admin page
admin.get('/admin/login', function (req, res) {
    if (req.session.adminLogged === true) {
        res.redirect('/admin')
    } else {
        res.render('pages/admin-login.ejs');
    }
});

// Redirect to team info page
admin.get('/admin/info', function (req, res) {
    res.redirect('https://teamnull-info.herokuapp.com')
});

// Process admin - login action
admin.post('/admin/login-verification', function (req, res) {
    connection.query('SELECT * FROM `QUANTRIVIEN` WHERE `QUANTRIVIEN`.TenDangNhapQTV = ? AND `QUANTRIVIEN`.MatKhauQTV = ?', [req.body.uname, req.body.pwd], function (error, rows) {
        if (!!error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log(rows);
            if (rows[0] === undefined) {
                console.log('The admin account is undefined!');
                res.redirect('/');
            } else {
                console.log('Login successfully!');
                req.session.adminLogged = true;
                res.redirect('/admin');
            }
        }
    });
});
// APIs
// Query id of comments
admin.get('/admin/query-comments', function (req, res) {
    connection.query('SELECT * FROM comment', function (error, rows) {
        if (!!error) {
            console.log('Query error!');
        } else {
            res.send(rows.id);
        }

    })
});

// Query all users
admin.get('/admin/all-users', function (req, res) {
    connection.query('Select * from KHACHHANG', function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            res.send(rows);
        }
    });
});

//Query all product
admin.get('/admin/all-products', function (req, res) {
    connection.query('Select * from CHITIETSANPHAM', function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            console.log(rows);
            res.send(rows);
        }
    });
})

// Query all helps
admin.get('/admin/all-helps', function (req, res) {
    connection.query('SELECT * FROM TROGIUP', function (error, rows) {
        if (!!error) {
            console.log(error);
        } else {
            res.send(rows);
        }
    });
});

// Query all orders
admin.get('/admin/allOrders', function (req, res) {
    connection.query('SELECT *, date_format(NgayDatMua, \'%d/%m/%Y\') as date FROM DONHANG', function (error, rows) {
        if (!!error) {
            console.log(error);
        } else {
            res.send(rows);
        }
    });
});
admin.post('/admin/processChange', function (req, res) {
    if (req.body.ID === undefined) {
    return;
    } else if (Array.isArray(req.body) === false) {
        connection.query('UPDATE `DONHANG` SET `TinhTrang` = ? WHERE `DONHANG`.`ID_DONHANG` = ?', [req.body.type, req.body.ID], function (error, rows) {
            if (!!error) {
                console.log(error);
            } else {
                console.log(rows);
            }
        });
    } else {
        req.body.ID.forEach(function (element) {
            connection.query('UPDATE `DONHANG` SET `TinhTrang` = ? WHERE `DONHANG`.`ID_DONHANG` = ?', [req.body.type, element], function (error, rows) {
                if (!!error) {
                    console.log(error);
                } else {
                    console.log(rows);
                }
            })
        });
    }
});

// Delete users
admin.post('/admin/users-submit-delete', function (req, res) {
    console.log(req.body.userselected);
    if (req.body.userselected === undefined) {
        res.redirect('/admin');
        return;
    } else if (Array.isArray(req.body.userselected) === false) {
        connection.query('DELETE FROM `KHACHHANG` WHERE `KHACHHANG`.`ID` = ?', [req.body.userselected], function (error, rows) {
            if (!!error) {
                console.log(error);
            } else {
                console.log(rows);
                res.redirect('/admin');
            }
        });
        return;
    } else {
        req.body.userselected.forEach(element => {
            connection.query('DELETE FROM `KHACHHANG` WHERE `KHACHHANG`.`ID` = ?', [element], function (error) {
                if (!!error) {
                    console.log(error)
                }
            });
        });
        res.redirect('/admin');
        return;
    }
});

// Add user
admin.post('/admin/add-user', function (req, res) {
    connection.query('INSERT INTO KHACHHANG(PHONE, PASSWORD, NAME, EMAIL) VALUES (?, ?, ?, ?)', [req.body.phone, req.body.password, req.body.name, req.body.email], function (error, rows) {
        if (!!error) {
            console.log('Error querying!');
            console.log(error);
        } else {
            console.log(rows);
            res.redirect('/admin');
        }
    });
});

// Delete Product
admin.post('/admin/products-submit-delete', function (req, res) {
    console.log(req.body.productselected);
    if (req.body.productselected === undefined) {
        res.redirect('/admin');
        return;
    } else if (Array.isArray(req.body.productselected) === false) {
        connection.query('DELETE FROM `CHITIETSANPHAM` WHERE `CHITIETSANPHAM`.`ID_SANPHAM` = ?', [req.body.productselected], function (error, rows) {
            if (!!error) {
                console.log(error);
            } else {
                console.log(rows);
                res.redirect('/admin');
            }
        });
        return;
    } else {
        req.body.productselected.forEach(element => {
            connection.query('DELETE FROM `CHITIETSANPHAM` WHERE `CHITIETSANPHAM`.`ID_SANPHAM` = ?', [element], function (error) {
                if (!!error) {
                    console.log(error)
                }
            });
        });
        res.redirect('/admin');
        return;
    }
});

// Update Product
admin.post('/admin/updateProduct', function (req, res) {
    connection.query('UPDATE `CHITIETSANPHAM` SET `TenSanPham` = ?, `HangSanXuat` = ?, `GiaTien` =  ?, `MauSac` = ?, `DungLuong` = ?, `SoLuotMua` = ?, `SoLuotXem` = ?, `ANH1` = ?, `ANH2` = ?, `ANH3` = ?, `MoTa` = ? WHERE `CHITIETSANPHAM`.`ID_SANPHAM` = ?', [req.body.updateName, req.body.updateBrand, req.body.updatePrice, req.body.updateColor, req.body.updateStorage, req.body.updateTransaction, req.body.updateView, req.body.updatePic1, req.body.updatePic2, req.body.updatePic3, req.body.updateDescription, req.body.productSelection], function (error, rows) {
        if (!!error) {
            console.log(error);
            res.redirect('/admin');
        } else {
            console.log(rows);
            res.redirect('/admin');
        }
    });
});

// Add Product
admin.post('/admin/add-product', function (req, res) {
    connection.query('INSERT INTO `CHITIETSANPHAM` (`TenSanPham`, `HangSanXuat`, `GiaTien`, `MauSac`, `DungLuong`, `SoLuotMua`, `SoLuotXem`, `ANH1`, `ANH2`, `ANH3`, `MoTa`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [req.body.name, req.body.brand, req.body.price, req.body.color, req.body.storage, req.body.buy, req.body.views, req.body.anh1, req.body.anh2, req.body.anh3, req.body.MoTa], function (error, rows) {
        if (!!error) {
            console.log('Error querying!');
            console.log(error);
        } else {
            console.log(rows);
            res.redirect('/admin');
        }
    });
});

// Delete comments
admin.post('/admin/helps-submit-delete', function (req, res) {
    console.log(req.body.helpselected);
    if (req.body.helpselected === undefined) {
        res.redirect('/admin');
        return;
    } else if (Array.isArray(req.body.helpselected) === false) {
        connection.query('DELETE FROM `TROGIUP` WHERE `TROGIUP`.`ID_TROGIUP` = ?', [req.body.helpselected], function (error, rows) {
            if (!!error) {
                console.log(error);
            } else {
                console.log(rows);
                res.redirect('/admin');
            }
        });
        return;
    } else {
        req.body.helpselected.forEach(element => {
            connection.query('DELETE FROM `TROGIUP` WHERE `TROGIUP`.`ID_TROGIUP` = ?', [element], function (error) {
                if (!!error) {
                    console.log(error)
                }
            });
        });
        res.redirect('/admin');
        return;
    }
});

// Get shared brand
admin.get('/admin/getShares', function (req, res) {
    
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            var queryData;
            connection.query('SELECT D1.HSX, SUM(D1.TONGTIEN) as y FROM DONHANG D1 group by D1.HSX', function (error, rows) {
                if (!!error) {
                    console.log(error);
                } else {
                    queryData = rows;
                    resolve(queryData);
                }
            })
            
        }, 300);
    });
    promise.then(function (value) {
        console.log(value);
        res.send(value);
    });
});

module.exports = admin