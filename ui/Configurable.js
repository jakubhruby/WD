goog.provide('wd.ui.Configurable');

goog.require('goog.asserts');
goog.require('goog.dom');

/**
 * Creates top-level wd object.
 * @constructor
 * @param {Object} config List of properties
 */
wd.ui.Configurable = function(config) {
	this.selfName = 'wd.ui.Configurable';

	this.assertObject(config, 'config is not an object');
	this.assertObject(config.scope, 'scope is not an object');

	this.config_(config);

	if (this.styles) {
		this.addStyles_();
	}
};

/**
 * Sets properties of an object.
 * @private
 * @param {Object} config List of properties
 */
wd.ui.Configurable.prototype.config_ = function(config) {
	var scope = config.scope;

	for (var item in config) {
		if (item !== 'scope') {
			scope[item] = config[item];
		}
	}
};

/**
* Adds a style link to the DOM structure if not exists. The CSS style file has to be of the same
* filename as its class JS file and to be in the same directory.
* @private
*/
wd.ui.Configurable.prototype.addStyles_ = function() {
	var href, linkEl;

	this.assertString(PATH_TO_CSS, 'styles is not a string');

	href = PATH_TO_CSS + '/' + this.selfName + '.css';

	if (!document.querySelector('head link[href="' + href + '"]')) {
		linkEl = goog.dom.createDom('link', {
			type: 'text/css',
			rel: 'stylesheet',
			href: href
		});
		document.querySelector('head').appendChild(linkEl);
	}
};

/**
 * Performs an assertion of String.
 * @protected
 * @param  {String} expression Assertion
 * @param  {String} message    Message, which will be prefixed with class name
 */
wd.ui.Configurable.prototype.assertString = function(expression, message) {
	goog.asserts.assertString(expression, this.selfName + ': ' + message);
};

/**
 * Performs an assertion of Object.
 * @protected
 * @param  {Object} expression Assertion
 * @param  {String} message    Message, which will be prefixed with class name
 */
wd.ui.Configurable.prototype.assertObject = function(expression, message) {
	goog.asserts.assertObject(expression, this.selfName + ': ' + message);
};

/**
 * Performs a default conditional assertion.
 * @protected
 * @param  {Boolean} expression Assertion
 * @param  {String} message    	Message, which will be prefixed with class name
 */
wd.ui.Configurable.prototype.assert = function(expression, message) {
	goog.asserts.assert(expression, this.selfName + ': ' + message);
};
