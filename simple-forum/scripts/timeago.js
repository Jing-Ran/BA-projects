;(function ($) {
  console.log('timeago js');

  const defaults = {
    // set defaults
  };

  function getDate(element) {
    let date = element.attr('date');
    if (!date && element.text()) {
      date = element.text();
    }
    if (!date) {
      throw 'No date could be found for', element;
    }
    return date;
  }

  function Timeago(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('timeago', this);
    this.init();
  }

  Timeago.prototype.init = function () {
    console.log('timeago initiated');
    this.date = getDate(this.element);
    this.dateMoment = moment(this.date);
    this.render();
  };

  Timeago.prototype.render = function () {
    const str = this.dateMoment.fromNow();
    this.element.text(str);
    const self = this;
    this.renderTimeout = setTimeout(() => {
      self.render();
    }, 1000);
    return this;
  };

  Timeago.prototype.stop = function () {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    return this;
  };

  $.fn.timeago = function (options) {
    this.each(function () {
      let $self = $(this), instance;
      if (instance === $self.data('timeago')) {
        if (typeof options === 'string'
          && typeof instance[options] == 'function') {
          instance[options]();
        } else {
          console.warn('Timeago already initialized on', this, 'and', options, 'is not a valid instance method');
        }
        return;
      }
      new Timeago($self, options);
    });
    return this;
  };


})(jQuery);