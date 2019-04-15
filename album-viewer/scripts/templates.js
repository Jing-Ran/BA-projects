(function ($, Handlebars) {
  console.log('templates');
  const albumTemp = $('#ablum-grid-template').html();
  const albumTemplateScript = Handlebars.compile(albumTemp);
  const thumbnailTemp = $('#thumbnail-modal-template').html();
  const thumbnailTemplateScript = Handlebars.compile(thumbnailTemp);

  $('.album-wrapper').albumGrid({
    albumTemplate: albumTemplateScript,
    thumbnailTemplate: thumbnailTemplateScript,
  });

  // albumCover inline helper
  Handlebars.registerHelper('albumCover', (photos, id) => {
    const cover = photos.find(photo => photo.albumId === id);
    return cover.thumbnailUrl;
  });

  // Handlebars.registerHelper('thumbnailModal', (albumId) => {

  // });
})(jQuery, Handlebars);