'use strict';

var _ = require('lodash-node'),
  fs = require('fs'),
  q = require('q'),
  nunjucks = require('nunjucks'),
  dateFilter = require('nunjucks-date-filter-local'),
  appRoot = require('app-root-path'),
  juice = require('juice'),
  transporter = require('nodemailer').createTransport(require(appRoot + '/config/config').mailer);

transporter.use('compile', require('nodemailer-html-to-text').htmlToText());

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(appRoot.toString()));

dateFilter.setDefaultFormat('[le] dddd DD MMMM YYYY');
env.addFilter('date', dateFilter);
env.addFilter('googleMap', function(coordinates) {
  return 'http://maps.google.com/maps?z=12&t=m&q=loc\:' + coordinates.lat + '+' + coordinates.long;
});


var message = {
  from: {
    name: 'GRIS-Québec',
    address: 'demystification@grisquebec.org'
  },
  attachments: [{
    filename: 'logo.png',
    path: __dirname + '/templates/img/0890b3b0.logopng.png',
    cid: 'logo'
  }]
};

function getCss(callback) {
  fs.readFile(appRoot + '/node_modules/muicss/dist/email/mui-email-inline.css', 'utf8', function(error, inlineCss) {
    if (error) return callback(error);
    fs.readFile(appRoot + '/node_modules/muicss/dist/email/mui-email-styletag.css', 'utf8', function(error, styleTagCss) {
      if (error) return callback(error);
      fs.readFile(__dirname + '/templates/css/styles.css', 'utf8', function(error, customCss) {
        if (error) return callback(error);
        callback(null, inlineCss + styleTagCss + customCss);
      });
    });
  });
}

function getAddress(user) {
  return user ? {
    name: user.toString(),
    address: user.getEmail()
  } : undefined;
}

module.exports = {

  notify: function(params) {

    var defered = q.defer();

    getCss(function(error, css) {

      if (error) return q.reject(error);

      transporter.sendMail(_.assign({}, message, {
        to: getAddress(params.receiver),
        bcc: _.map(params.receivers, getAddress),
        subject: params.subject || params.title,
        html: juice(env.render(params.templatePath, _.assign(params.data, {
          title: params.title || params.subject
        })), {
          extraCss: css
        })
      }), function(error, result) {
        if (error) return q.reject(error);
        defered.resolve(result);
      });
    });

    return defered.promise;
  }
};
