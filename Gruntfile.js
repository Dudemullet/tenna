'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            options : {
                force: true
            },
            all: [
            'build/**/*', //Delete everything in build EXCEPT ->
            '!build/videos/**', // User uploaded movies
            '!build/bower_components/**' // Deps installed via bower
            ]
        },
        copy: {
            assets: {
                files: [
                    { expand: true, cwd: 'src/bin/js/libs/flat-ui', src: [ 'fonts/**' ], dest: 'build/' },
                    { expand: true, flatten: true, cwd: 'src/css', src: [ '**' ], dest: 'build/css' },
                    { expand: true, flatten: false, cwd: 'src/bin', src: [ '**' ], dest: 'build/' },
                    { expand: true, flatten: false, cwd: 'src/', src: [ 'js/**' ], dest: 'build/' }
                ]
            },
            deps: {
                files : [
                    {cwd:"node_modules/", src:"flat-ui/**", dest:"src/bin/js/libs/", expand:true},
                    {   
                        cwd:"node_modules/blueimp-file-upload/js",
                        src:"jquery.fileupload.js",
                        dest:"build/js/libs/",
                        expand:true
                    },
                    {   
                        cwd:"node_modules/blueimp-file-upload/js/vendor",
                        src:"jquery.ui.widget.js",
                        dest:"build/js/libs/",
                        expand:true
                    },
                ]
            }
        },
        mkdir: {
            assets: {
                options: {
                    create: ['build/wallpapers', 'build/videos', 'build/encode']
                }
            }
        }, 
        less: {
            dev: {
                options: {
                    paths: [ "src/less" ]
                },
                files: {
                    "build/css/app.css": "src/less/app.less"
                }
            }
        },
        watch: {
            dev: {
                files: ['src/less/**', 'src/bin/views/**', 'src/js/**',"src/coffee/**","src/bin/config.js"],
                tasks: [ 'default' ]
            }
        },
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'src/coffee',
                src: ['*.coffee'],
                dest: 'build/js',
                ext: '.js'
            }
        },
        browserify : {
            vendor: {
                src: ['src/bin/js/app.js'],
                dest: 'src/bin/js/vendor.js'
            }
        }
    });

    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('compile', ['less','coffee']);
    grunt.registerTask('build', [ 'clean', 'copy:deps','browserify','copy:assets','mkdir:assets','compile']);
    grunt.registerTask('default', [ 'build' ]);
    grunt.registerTask('serve', [ 'server' ]);

};
