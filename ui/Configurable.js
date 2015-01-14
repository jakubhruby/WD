goog.provide('wd.ui.Configurable');

wd.ui.Configurable = function(config) {
	this.config(this, config);
};

wd.ui.Configurable.prototype.config = function(scope, config) {
	for (var item in config) {
		scope[item] = config[item];
	}
};
