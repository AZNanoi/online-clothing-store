// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function


module.exports = function(grunt) {
    var modRewrite = require('connect-modrewrite');
    var serveStatic = require('serve-static');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Project settings
        paths: {
            //Configurable paths
            app: 'app',
            dist: 'dist',
            assets: 'app/assets'
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {expand: true, cwd: '<%= paths.app %>/', src: 'index.html', dest: '<%= paths.dist %>/'},
                    {expand: true, cwd: '<%= paths.app %>/', src: 'assets/partials/*.html', dest: '<%= paths.dist %>/'}
                ]
            }
        },

        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/assets/css/<%= pkg.name %>.min.css': ['app/assets/build/css/*.css', '!app/assets/build/css/*.css.map']
                }
            }
        },


        sass: {
            dist:{
                files: {
                    '<%= paths.assets %>/build/css/styles.css':'<%= concat.scss.dest %>'
                }
            }
        },

        concat: {
            js: {
                src: ['<%= paths.assets %>/js/*.js', '<%= paths.assets %>/js/controllers/*.js'],
                dest: '<%= paths.assets %>/build/js/scripts.js'
            },
            scss: {
                src: ['<%= paths.assets %>/sass/**/*.scss', '!<%= paths.assets %>/sass/styles.scss'],
                dest: '<%= paths.assets %>/sass/styles.scss'
            }
        },

        jshint: {
            // configure JSHint
            options: {
                reporterOutput: "",
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true
                }
            },

            // define the files to lint
            files: ['Gruntfile.js', '<%= paths.assets %>/**/*.js']
        },

        clean: {
            build: ['./<%= paths.assets %>/build'],
            dist: ['./<%= paths.dist %>']
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    base: '<%= paths.dist %>',
                    open: true,
                    livereload:true,
                    middleware: function (connect) {
                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            serveStatic('dist'),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            serveStatic('dist')
                        ];
                    }

                }
            }
        },

        express:{
            all:{
                options:{
                    port:8080,
                    hostname:'localhost',
                    bases:['<%= paths.dist %>'],
                    livereload:true,

                }
            }
        },

        copy: {
            dist: {
                files: [
                    {expand: true, cwd: '<%= paths.app %>/', src: 'bower_components/**', dest: '<%= paths.dist %>/'},
                    {expand: true, cwd: '<%= paths.app %>/', src: 'REST_API/**', dest: '<%= paths.dist %>/'},
                    {expand: true, cwd: '<%= paths.app %>/', src: 'assets/images/**', dest: '<%= paths.dist %>/'}
                ]
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n',
                beautify : true,
                mangle   : true
            },
            dist: {
                files: {
                    '<%= paths.dist %>/assets/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },

        watch: {
            options: {livereload: true},
            js: {
                files: ['<%= concat.js.src %>'],
                tasks: ['concat:js', 'uglify']
            },
            sass: {
                files: ['<%= concat.scss.src %>'],
                tasks: ['concat:scss', 'sass', 'cssmin']
            },
            html: {
                files: ['<%= paths.assets %>/partials/*.html', '<%= paths.app %>/index.html'],
                tasks: ['htmlmin']
            },
            jshint: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            },
            copy:{
                files: ['<%= paths.assets %>/images/**'],
                tasks: ['copy']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('build', [
        'clean',
        'concat',
        'sass:dist',
        'cssmin',
        'uglify',
        'copy',
        'htmlmin'
    ]);

    grunt.registerTask('serve', ['build', 'connect:server', 'express', 'watch']);

    grunt.registerTask('default', ['jshint']);

};