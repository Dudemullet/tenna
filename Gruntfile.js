'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            build: ['build/'],
            tmp: ['tmp/']
        },
        copy: {
            assets: {
                files: [
                    { expand: true, cwd: 'src/', src: [ 'fonts/**' ], dest: 'build/' },
                    { expand: true, flatten: true, cwd: 'src/css', src: [ '**' ], dest: 'build/css' },
                    { expand: true, flatten: false, cwd: 'src/bin', src: [ '**' ], dest: 'build/' },
                    { expand: true, flatten: false, cwd: 'src/', src: [ 'js/**' ], dest: 'build/' }
                ]
            },
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
                files: ['src/less/**', 'src/bin/views/**', 'src/js/**',"src/bin/videos/**","src/bin/wallpapers/**"],
                tasks: [ 'default' ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [ 'clean', 'copy','less' ]);
    grunt.registerTask('default', [ 'build' ]);
    grunt.registerTask('serve', [ 'server' ]);

};
