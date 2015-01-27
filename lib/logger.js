'use strict';

var colors  = require('cli-color');

/**
 *
 * Constructor Logger
 *
 */
var Logger = function (message) {

  this.message = message || null;

};

Logger.prototype.addPleeease = function (message) {

  return colors.inverse('Pleeease ') + message;

};

Logger.prototype.log = function () {

  var message = colors.cyan(this.message);
      message = this.addPleeease(message);

  console.log(message);

};

Logger.prototype.error = function () {

  throw new Error(this.message);

};

Logger.prototype.success = function () {

  var message = colors.green(this.message);
      message = this.addPleeease(message);

  console.log(message);

};

/**
 *
 * New logger instance
 *
 */
var logger = function () {
  return new Logger();
};
logger.log = function (message) {
  return new Logger(message).log();
};
logger.error = function (message) {
  return new Logger(message).error();
};
logger.success = function (message) {
  return new Logger(message).success();
};

/**
 *
 * Exports
 *
 */
module.exports = logger;