'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    express: {
      options: {
        port: process.env.PORT || 9011
      },
      dev: {
        options: {
          script: 'index.js'
        }
      },
      prod: {
        options: {
          script: 'index.js',
          'node_env': 'production'
        }
      }
    },

    watch: {
      express: {
        files: [
          'index.js',
          'app/**/*.js',
          'app/**/**/*.js'
        ],
        tasks: ['jshint:all', 'express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'app/{,*/}*.js'
      ]
    }
  });

  grunt.registerTask('dev', ['express:dev', 'watch']);

  grunt.registerTask('test-email', function() {

    var done = this.async();

    var expressBase = require('express-base'),
      path = require('path'),
      mongoose = require('mongoose'),
      config = require('./config/config');

    mongoose.Promise = require('q').Promise;
    mongoose.connect(config.mongoose.URI);

    expressBase.getGlobbedFiles('./app/models/*.js').concat(expressBase.getGlobbedFiles('./app/**/models/*.js')).forEach(function(modelPath) {
      require(path.resolve(modelPath));
    });

    var InterventionService = require('./app/interventions/services/intervention.service');

    InterventionService.sendNotifications('confirmation-intervention', '5856f9b81deb491b3f2d82d4').then(function(results) {
      console.log(JSON.stringify(results));
      done();
    }).catch(function(error) {
      console.error(error);
      done();
    });

  });
};
