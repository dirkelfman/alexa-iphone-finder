module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    lambda_package: {
      default: {
        options: {
          include_files: [
            'config.json',
            './config.json',

          ]
        // Task-specific options go here.
        }
      }
    },
    lambda_deploy: {
      default: {
        arn: 'arn:aws:lambda:us-east-1:663361677957:function:iphone-finder-skill',
        options: {
          // Task-specific options go here.
        }
      }
    },
    clean: {
      build: ["dist"]
    },
    jshint: {
      all: ['Gruntfile.js', 'app.js', '_testdriver.js' ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-aws-lambda');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  
  // Load the plugin that provides the "uglify" task.

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('deploy', ['default', 'clean', 'lambda_package', 'lambda_deploy']);

};