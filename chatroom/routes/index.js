var express = require('express');
var router = express.Router();
var User = require('../modules/user.js');

module.exports = function (app) {
  // get login page
  app.get('/', function(req, res) {
    res.render('index', {
      registerErr: req.flash('registerErr').toString(),
      loginErr: req.flash('loginErr').toString(),
    });
  });
  
  app.post('/', function (req, res) {
    if (req.body.registerBtn) {
      var name = req.body.newNameInput,
          password_1 = req.body.newPassInput_1,
          password_2 = req.body.newPassInput_2;
      if (password_2 != password_1) {
        req.flash('registerErr', 'password not consistent, try again');
        return res.redirect('/');
      } else {
        User.get(name, function (err, result) {
            if (err) {
              req.flash('registerErr', err.toString());
              return res.redirect('/');
            }
            if (result) {
              req.flash('registerErr', 'nickname already existed, use another one');
              return res.redirect('/');
            }
        });
        var newUser = new User({
          name: name,
          password: password_1
        });
        newUser.save(function (err, result) {
          if (err) {
            req.flash('registerErr', err.toString());
            return res.redirect('/');
          }
          req.session.user = result;
          res.redirect('/chat');
        });
      }
    } else {
      var name = req.body.nicknameInput,
          password_origin = req.body.passInput;
      User.get(name, function(err, user) {
        if (err) {
          req.flash('loginErr', err.toString());
          return res.redirect('/');
        }
        if (!user) {
          req.flash('loginErr', name + ' does not exist');
          return res.redirect('/');
        }
        if (user.password != password_origin) {
          req.flash('loginErr', 'wrong password');
          return res.redirect('/');
        }
        req.session.user = user;
        res.redirect('/chat');
      });
    }
  });

  app.get('/chat', function(req, res) {
    if (req.session && req.session.user) {
      User.get(req.session.user.name, function (err, result) {
        if (!result) {
          req.session.reset();
          res.redirect('/');
        } else {
          res.locals.user = req.session.user;
          res.render('chat', {
            user: req.session.user.name.toString()
          });
        }
      });
    } else {
      res.redirect('/');
    }
  });
};
