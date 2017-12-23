module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "src",
                    "src": ["*.js"],
                    "dest": ".",
                    "ext": ".js"
                }]
            }
        },
        uglify: {
            dev: {
                options: {
                    compress: true,
                    mangle: true,

                },
                files: [{
                    expand: true,
                    src: 'main.js',
                    dest: '.',
                    cwd: '.',
                    rename: function (dst, src) {
                        // To keep src js files and make new files as *.min.js :
                        return  src;
                    }
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask("default", ["babel"]);
};