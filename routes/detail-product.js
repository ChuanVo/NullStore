const express = require('express')
const app = express.Router()
const connection = require('./connection')

app.get('/detail/:hangsanxuat/:id', (req, res) => {
    console.log(req.params.hangsanxuat);
    console.log(req.params.id);
    connection.query('SELECT *, format(CHITIETSANPHAM.GiaTien *(1- KHUYENMAI.GIATRI_KM), 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat = ? AND ID_SANPHAM = ?', [req.params.hangsanxuat, req.params.id], (err, results, files) => {
        if (!err) {
            req.session.chiTiet = results;
            res.render('pages/detail-product', { chitiet: req.session.chiTiet, isSuccess: req.session.isLogged, user: req.session.user, avaValue: req.session.avaValue });
            console.log(req.session.chiTiet);
        }
        else {
            req.session.chiTiet = results;
            res.render('pages/detail-product', { chitiet: req.session.chiTiet, isSuccess: req.session.isLogged, user: req.session.user, avaValue: req.session.avaValue });
            console.log(req.session.chiTiet);
        }
    })

})

app.post('/detail/submitOrder', (req, res) => {
    console.log(req.body);
    connection.query('SELECT * FROM CHITIETSANPHAM a WHERE a.DungLuong = ? and a.HangSanXuat = ? and a.TenSanPham = ?', [req.body.DungLuong, req.body.HangSanXuat, req.body.TenSP], (error, results) => {
        if (!!error) {
            console.log(error);
        }
        else {
            console.log(results);
            req.session.chiTiet = results;
            connection.query(`INSERT INTO DONHANG (SDT_KhachHang, ID_SP, ID_CTSP, HSX, SoLuong, TongTien, NgayDatMua, TinhTrang) VALUES (?, ?, ?, ?, ?, ?,  CURRENT_TIMESTAMP, '0')`, [req.session.user.PHONE, results[0].ID_SANPHAM, results[0].ID_CTSANPHAM, req.body.HangSanXuat, req.body.SoLuong, req.body.GiaTien], (error, results) => {
                if (!!error) {
                    console.log(error);
                }
                else {
                    console.log("hah");
                }
            })
        }
    })
})
module.exports = app


