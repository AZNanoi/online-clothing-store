// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Project settings
        paths: {
            //Configurable paths
            app: 'app',
            dist: 'dist'
        },

        sass: {
            dist: {
                files: {
                    'css/style.css' : 'sass/style.scss'
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            // configure JSHint
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                }
            },

            // define the files to lint
            files: ['Gruntfile.js', 'src/**/*.js', 'test/spec/{,*/}*.js']
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },

        //Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML
        'bower-install': {
            app: {
                html: '<%= paths.app %>/index.html',
                ignorePath: '<%= paths.app %>/'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: '<%= paths.dist %>/scrits/{,*/}*.js'
                }
            }
        },

        useminPrepare: {
            options: {
                dest: '<%= paths.dist %>'
            },
            html: '<%= paths.app %>/index.html'
        },

        //Performs rewrites based on rev and the useminPrepare
        usemin: {
            options: {
                assetsDirs: ['<%= paths.dist %>']
            },
            html: ['<%= paths.app %>/index.html']
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= paths.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: true,
                //Change this to '0.0.0.0' to access the server from
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= paths.app %>'
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= paths.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= paths.app %>',
                    livereload: false

                }
            },

        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= paths.dist %>',
                        '<%= paths.dist %>/.git'
                    ]
                }]
            },
            server: '.tmp'
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('serve', function(target){
        if(target === 'dist'){
            return grunt.task.run(['build'])
        }

        grunt.task.run([

            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function(){
        grunt.log.warn('The `server` task has been deprecated! Use `serve`!');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
