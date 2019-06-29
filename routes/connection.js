const mysql = require('mysql')

var connection  = mysql.createConnection({
    host: 'db4free.net',
    user: 'teamnull',
    password: 'null@2018',
    database: 'nullstore'
});

connection.connect(function(error) {
    if(!!error) {
        console.log('Error connecting!');
    }
});

module.exports = connection;