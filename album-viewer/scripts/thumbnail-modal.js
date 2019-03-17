;(function ($) {
  console.log('thumbnail modal');

  const defaults = {};

  function ThumbnailModal(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('thumbnailModal', this);
    this.init();
  }

  ThumbnailModal.prototype.init = function () {
    console.log('thumbnail init', this);
    const self = this;
    // Album on click
    self.element.on('click', '.album__cover', e => {
      const albumId = $(e.currentTarget).parent().data('albumId');
      // console.log(albumId);
      self.openThumbnailModal(albumId);
    });
  };

  ThumbnailModal.prototype.openThumbnailModal = function (albumId) {
    console.log('open album');
    this.config.filteredPhotos = this.config.photos
      .filter(photo => photo.albumId === albumId);
    const htmlTemplate = this.config.thumbnailTemplate(this.config);
    $('.thumbnail-modal').html(htmlTemplate);
    $('.thumbnail-modal-close').on('click', 'i', this.closeThumbnailModal);

    $('.thumbnail-modal').fadeIn(350, function () {
      $(this).addClass('js-open-modal');
    });
  };

  ThumbnailModal.prototype.closeThumbnailModal = function () {
    console.log('close album');
    $('.thumbnail-modal').fadeOut(350, function () {
      $(this).empty();
      $(this).removeClass('js-open-modal');
    });
  };

  $.fn.thumbnailModal = function (options) {
    new ThumbnailModal(this, options);
    return this;
  };
})(jQuery);