goog.provide('wd.gui.form.TextField');

goog.require('wd.gui.form.Field');

wd.gui.form.TextField = function(config) {
  wd.gui.form.Field.call(this, config);
};
goog.inherits(wd.gui.form.TextField, wd.gui.form.Field);

wd.gui.form.TextField.prototype.render = function(parentEl) {
  var fieldEl = goog.dom.createDom('input', {
    type: 'text',
    title: this.title,
    placeholder: this.placeholder,
    class: this.class,
    style: this.style
  });

  if (parentEl) {
    goog.dom.appendChild(parentEl, fieldEl);
  }
  else {
    return fieldEl;
  }
};
