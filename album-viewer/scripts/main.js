(function ($) {
  console.log('hello');

  $(document).ajaxStop(() => {
    console.log('main js');

    // Nav button on click
    const $nav = $('.nav');

    $nav.on('click', 'button', e => {
      console.log(e.currentTarget);
      const $currentAlbumPage = $('.album-page.js-album-active');
      const $nextAlbumPage = $currentAlbumPage.prev($('.album-page'));
      const $prevAlbumPage = $currentAlbumPage.next($('.album-page'));

      if ($(e.currentTarget).hasClass('nav-btn--right')) {
        console.log('if');
        $currentAlbumPage.hide('fade', {
          duration: 300,
          complete: function () {
            $nextAlbumPage.show('fade', {
              duration: 300,
              complete: function () {
                $nextAlbumPage.addClass('js-album-active');
              }
            });

            $currentAlbumPage.removeClass('js-album-active');
          }
        });
      } else if ($(e.currentTarget).hasClass('nav-btn--left')) {
        console.log('else if');
        $currentAlbumPage.hide('fade', {
          duration: 300,
          complete: function () {
            $prevAlbumPage.show('fade', {
              duration: 300,
              complete: function () {
                $prevAlbumPage.addClass('js-album-active');
              }
            });

            $currentAlbumPage.removeClass('js-album-active');
          }
        });
      }
    });

  });

})(jQuery);