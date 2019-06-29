const express = require('express')
const app = express.Router()
const connection = require('./connection')

/*
app.get('/sale', function(req, res) {
    res.render('pages/sale.ejs', {isSuccess: req.session.isLogged, user: req.session.user, avaValue: req.session.avaValue})
  //  res.render('pages/sale.ejs', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick });
})*/


app.get('/sale', (req, res) => {
    console.log('1');
   // connection.query('SELECT * FROM `CHITIETSANPHAM`, `KHUYENMAI` WHERE `KHUYENMAI`.`ID_KHUYENMAI` = `CHITIETSANPHAM`.`KhuyenMai`', (err, results, files) => {
    connection.query('SELECT SP.ID_SANPHAM, SP.TenSanPham, SP.HangSanXuat, SP.DungLuong, SP.GiaTien, KM.TEN_KM, KM.GIATRI_KM, format((SP.GiaTien - KM.GIATRI_KM * SP.GiaTien), 0) as Money FROM CHITIETSANPHAM AS SP, KHUYENMAI AS KM WHERE KM.ID_KHUYENMAI = SP.KhuyenMai AND KM.GIATRI_KM > 0', (err, results, files) => {
        if (!err) {
             req.session.topbuttonclick = 1;
             console.log(results);
            res.render('pages/sale.ejs', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/sale.ejs', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})

module.exports = app
