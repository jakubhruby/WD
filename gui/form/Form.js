goog.provide('wd.gui.form.Form');

goog.require('goog.dom');
goog.require('wd.ui.Configurable');

/**
 * Creates an empty form.
 * @constructor
 * @param {Object} config List of properties
 */
wd.gui.form.Form = function(config) {
	config.scope = this;
	config.selfName = 'wd.gui.form.Form';
	goog.base(this, config);

	this.methods = [
		'get',
		'post'
	];

	this.assert(this.methods.indexOf(this.method) >= 0, 'method is not valid');

	this.el = goog.dom.createDom('form', {
		method: this.method
	});
};
goog.inherits(wd.gui.form.Form, wd.ui.Configurable);

/**
 * Returns the DOM object.
 * @return {Object} DOM object
 */
wd.gui.form.Form.prototype.getEl = function() {
	return this.el;
};
