/**
 * Created by HuFolder on 1/17/18.
 */
var settings = require('../settings');
var con = require('mysql').createConnection({
    host: settings.host,
    user: settings.user,
    password: settings.password,
    database: settings.database
});
con.connect(function (err) {
    if (err) {
        throw err;
    }
});

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

User.prototype.save = function (callback) {
    var user = {
        name : this.name,
        password: this.password
    };
    var sql = "INSERT INTO USER (NAME, PASSWORD) VALUES ('" + user.name + "', '" + user.password + "');";
    con.query(sql, function (err, result) {
        if (err) {
            return callback(err);
        }
    });
    var newsql = "SELECT * FROM USER WHERE NAME = '" + user.name + "';";
    con.query(newsql, function (err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result[0]); // register success
    })
};

User.get = function(name, callback) {
    var sql = "SELECT * FROM USER WHERE NAME = '" + name + "';";
    con.query(sql, function (err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result[0]); // register success
    });
};
