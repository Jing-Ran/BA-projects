;(function ($) {
  console.log('world');
  const $wrapper = $('.album-wrapper');

  const defaults = {
    // set defaults
    localData: {},
    albumData: {},
    photoData: [],
    albumPerPage: [],
    url: 'https://jsonplaceholder.typicode.com/',
    startIndex: 0,
    albumNum: 20,
  };

  function hideLoader() {
    console.log('hiding');
    $('.preloader').fadeOut(2000, function () {
      // $(this).hide();
    });
  }

  function sliceData(albums) {
    const results = [];
    let startI = 0;
    const numPerPage = 20;

    while (startI < albums.length) {
      results.unshift(albums.slice(startI, startI + numPerPage));
      startI += numPerPage;
    }

    return results;
  }

  function AlbumGrid(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('albumGrid', this);
    this.init();
  }

  AlbumGrid.prototype.init = function () {
    // plugin logic goes here...
    this.getAlbums();
    this.getPhotos();
    $(document).ajaxStop(() => {
      console.log('both done');
      this.populateAlbums(this.config.localData.albums);
      hideLoader();
    });
  };

  AlbumGrid.prototype.getAlbums = function () {
    console.log('get albums');
    $.ajax({
      url: `${this.config.url}albums`,
    })
    .done(data => {
      this.config.localData.albums = data;
      console.log('done albums');
    })
    .fail(() => {
      console.error('Fail to get albums');
    });
  };

  AlbumGrid.prototype.getPhotos = function () {
    console.log('get photos');
    $.ajax({
      url: `${this.config.url}photos`,
    })
    .done(data => {
      this.config.localData.photos = data;
      console.log('done photos');
    })
    .fail(() => {
      console.error('Fail to get photos');
    });
  };

  AlbumGrid.prototype.populateAlbums = function (data) {
    const config = this.config;
    config.albumData = sliceData(data);

    const htmlTemplate = config.albumTemplate(config);

    $wrapper.html(htmlTemplate);
    $('.album-page:last-of-type').fadeIn(1700, function () {
      $(this).addClass('js-album-active');
    });

    // Add photos to each album - thumbnailModal
    this.element.thumbnailModal({
      thumbnailTemplate: config.thumbnailTemplate,
      photos: config.localData.photos,
    });
  };

  $.fn.albumGrid = function (options) {
    new AlbumGrid(this, options);
    return this;
  };


})(jQuery);