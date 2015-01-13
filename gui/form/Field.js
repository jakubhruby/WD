goog.provide('wd.gui.form.Field');

goog.require('goog.dom');

wd.gui.form.Field = function (config) {
  var i;

  for (i in config) {
    this[i] = config[i];
  }
};
