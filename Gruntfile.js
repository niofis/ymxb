module.exports = function(grunt) {
    grunt.initConfig({
        sweetjs: {
            options: {
                modules: ['./js/es6-macros'],
                sourceMap: true,
                nodeSourceMapSupport: true,
                  readableNames: true
            },
            js: {
                files: [{
                  expand: true,
                  cwd: 'js/',
                  src: ['**/*.sjs.js'],
                  dest: 'js/',
                  ext: '.js',
                  extDot: 'first'
                }]
            }
        },
        watch: {
            options: {
                nospawn: true
            },
            sweetjs: {
                files: ['js/**/*.js'],
                tasks: ['sweetjs:js']
            }
        }
    });
 
    grunt.event.on('watch', function(action, filepath, target) {
        if(action == 'changed' && target == 'sweetjs') {
            grunt.config.set('sweetjs.src.src', [filepath]);
            grunt.config.set('sweetjs.src.dest', filepath.replace(/^js/, 'build'));
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sweet.js');
 
    grunt.registerTask('default', ['sweetjs']);
};