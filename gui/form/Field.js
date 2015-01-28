goog.provide('wd.gui.form.Field');

goog.require('goog.dom');
goog.require('wd.ui.Configurable');

/**
 * Creates basic form field and sets its default attrs.
 * @param {object} config List of properties
 */
wd.gui.form.Field = function (config) {
	config.scope = this;
	config.selfName = 'wd.gui.form.Field';
	goog.base(this, config);

	this.elTypes = [
		'input',
		'textarea',
		'select'
	];

	this.assertString(this.elType, 'elType is not a string');
	this.assert(this.elTypes.indexOf(this.elType) >= 0, 'elType is not valid');
	this.assertString(this.name, 'name is not a string');

	this.el = goog.dom.createDom(this.elType, {
		name: this.name
	});
};
goog.inherits(wd.gui.form.Field, wd.ui.Configurable);

/**
 * Returns the DOM object.
 * @return {Object} Dom object
 */
wd.gui.form.Field.prototype.getEl = function() {
	return this.el;
};
