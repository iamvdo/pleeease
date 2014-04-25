var fs         = require('fs'),
	path       = require("path"),
	extend     = require('deep-extend');

var configFile = ".pleeeaserc";

var options = {
	input: ["*.css"],
	output: "app.min.css",
	
	autoprefixer: true,
	minifier: true,
	mqpacker: true,
	polyfills: {
		variables: false,
		rem: true
	}
};

// check for .pleaserc config file
if ((fs.existsSync || path.existsSync)(configFile)) {
	var config = JSON.parse(fs.readFileSync(configFile));

	options = extend(options, config);

}

module.exports = options;