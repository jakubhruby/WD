goog.provide('wd.gui.form.TextField');

goog.require('wd.gui.form.Field');

/**
 * Creates a text field.
 * @constructor
 * @param {Object} config List of properties
 */
wd.gui.form.TextField = function(config) {
	var attributes;

	config.scope = this;
	config.selfName = 'wd.gui.form.TextField';
	config.elType = 'input';
	config.type = config.type || 'text';
	goog.base(this, config);

	this.types = [
		'text',
		'email',
		'tel',
		'number',
		'password'
	];

	this.setAttributes_();
};
goog.inherits(wd.gui.form.TextField, wd.gui.form.Field);

/**
 * Sets field attributes.
 */
wd.gui.form.TextField.prototype.setAttributes_ = function() {
	var attributes;

	this.assert(this.types.indexOf(this.type) >= 0, 'type is not valid');
	this.assert(!this.placeholder || typeof this.placeholder === 'string', 'placeholder is not a string');
	this.assert(!this.classes || typeof this.classes === 'string', 'classes is not a string');

	attributes = {
		type: this.type
	};
	if (this.placeholder) {
		attributes.placeholder = this.placeholder;
	}
	if (this.classes) {
		attributes.class = this.classes;
	}

	goog.dom.setProperties(this.el, attributes);
};
