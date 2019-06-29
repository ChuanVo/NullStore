const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const subdomain = require('express-subdomain');

const connection = require('./routes/connection')
const contact = require('./routes/contact')
const sale = require('./routes/sale')
const login = require('./routes/login')
const register = require('./routes/register')
const profile = require('./routes/profile')
const admin = require('./routes/admin')
const detailproduct = require('./routes/detail-product')

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

const app = express()
app.use(subdomain('admin', admin))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


var sessionStore = new MySQLStore({
    host: 'db4free.net',
    user: 'teamnull',
    password: 'null@2018',
    database: 'nullstore',
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


// render Home page of NULLStore
app.get('/', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM', (err, results, files) => {
        if (!err) {
            res.render('pages/index',
                {
                    sanpham: results,
                    isSuccess: req.session.isLogged,
                    user: req.session.user,
                    topbuttonclick: req.session.topbuttonclick,
                    avaValue: req.session.avaValue
                });
        }
        else {
            res.render('pages/index',
                {
                    sanpham: results,
                    isSuccess: req.session.isLogged,
                    user: req.session.user,
                    topbuttonclick: req.session.topbuttonclick,
                    avaValue: req.session.avaValue
                });
        }
    })
})


// new product
app.get('/sanphammoinhat', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM', (err, results, files) => {
        if (!err) {
            req.session.topbuttonclick = 1;
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})



// best seller, base on view-numbers of CHITIETSANPHAM table data to query
app.get('/sanphambanchay', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM ORDER BY SoLuotXem DESC', (err, results, files) => {
        if (!err) {
            req.session.topbuttonclick = 2;
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})

// best visited, base on bought-numbers of CHITIETSANPHAM table data to query
app.get('/sanphamxemnhieu', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI ORDER BY SoLuotMua DESC', (err, results, files) => {
        if (!err) {
            req.session.topbuttonclick = 3;
            console.log(results);
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})

app.get('/sanphamtheogiacaothap', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI ORDER BY GiaTien DESC', (err, results, files) => {
        if (!err) {
            req.session.topbuttonclick = 3;
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})

app.get('/sanphamtheogiathapcao', (req, res) => {
    connection.query('SELECT *, format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI ORDER BY GiaTien ASC', (err, results, files) => {
        if (!err) {
            req.session.topbuttonclick = 3;
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})

// product belong to producers, base on producer-name of SANPHAM table data to query
app.get('/apple', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="Apple" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/samsung', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="Samsung" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/sony', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="Sony" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/oppo', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="Oppo" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/xiaomi', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="XiaoMi" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/huawei', (req, res) => {
    connection.query('SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM, KHUYENMAI WHERE CHITIETSANPHAM.KhuyenMai = KHUYENMAI.ID_KHUYENMAI AND HangSanXuat ="Huawei" ', (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
    })
})
app.get('/search', (req, res) => {
    var sql = 'SELECT *,format(GiaTien, 0) as Money FROM CHITIETSANPHAM WHERE TenSanPham LIKE "%' + req.query.searchVal + '%"';
    connection.query(sql, (err, results, files) => {
        if (!err) {
            res.render('pages/index', { sanpham: results, isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
        else {
            res.render('pages/index', { isSuccess: req.session.isLogged, user: req.session.user, topbuttonclick: req.session.topbuttonclick, avaValue: req.session.avaValue });
        }
    })
})


//navigation 
//app.get('/contact', contact)
app.use(admin)
app.use(contact)
app.use(sale)
app.use(login)
app.use(register)
app.use(profile)
app.use(detailproduct)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
