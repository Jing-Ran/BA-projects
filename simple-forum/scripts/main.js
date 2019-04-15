(function ($, Handlebars) {
  console.log('main js');
  const postTemp = Handlebars.compile($('#post-template').html());
  const recentCommentTemp = Handlebars.compile($('#recent-comment-template').html());
  const url = 'https://jsonplaceholder.typicode.com/';
  const localData = {
    posts: [],
    users: [],
    comments: [],
  };
  const currentUser = {
    name: 'Jing Ran',
    username: 'Frontenddev',
    email: 'jingran@develop.com',
    // posts: [],
    // comments: [],
  };

  // Toggle posts
  function openPost(currentPost) {
    console.log('open post');
    const $postContent = currentPost.children('.post__content');
    const $commentIcon = currentPost.find('.comment-icon');
    const $comments = currentPost.children('.post__comments');
    console.log($comments);
    // Close all opened posts
    closePosts();

    if (!currentPost.hasClass('js-expanded--post')) {
      console.log('if');
      currentPost.addClass('js-expanded--post');
      $postContent.slideDown();
      // $comments.css('display', 'block');
      $comments.show();
      $commentIcon.show();
    } else {
      console.log('else');
    }
    console.log('end of open post');
  }

  function closePosts() {
    console.log('close all');

    $('.js-expanded--post').each(function () {
      // console.log('each', this);
      const $postContent = $(this).children('.post__content');
      const $commentBlock = $(this).children('.post__comments');
      const $commentIcon = $(this).find('.comment-icon');

      $(this).removeClass('js-expanded--post');
      $postContent.slideUp();
      $commentIcon.hide();
      $commentBlock.slideUp();

      closeComments($commentBlock);
    });
  }

  // Toggle Comments
  function openComments(commentBlock) {
    console.log('open comments', commentBlock);
    const $commentList = commentBlock.children('.comment-list');
    const $commentForm = commentBlock.children('.create-comment');

    commentBlock.addClass('js-expanded--comments');
    $commentList.slideDown();
    $commentForm.slideDown();
  }

  function closeComments(commentBlock) {
    console.log('close comments');
    const $commentList = commentBlock.children('.comment-list');
    const $commentForm = commentBlock.children('.create-comment');

    commentBlock.removeClass('js-expanded--comments');
    $commentList.slideUp();
    $commentForm.slideUp();
  }

  function toggleComments(commentIcon) {
    console.log('toggle comments', commentIcon);
    const $commentBlock = $(commentIcon).parent('.post__comments');

    if ($commentBlock.hasClass('js-expanded--comments')) {
      console.log('if close comment');
      closeComments($commentBlock);
    } else {
      console.log('else open comment');
      openComments($commentBlock);
    }
  }

  // Count comment number
  function countComments(post) {
    const $commentNum = post.find('.comment-num');
    const $comments = post.find('.comment');
    $commentNum.text($comments.length);
  }

  // Add the latest comment to Recent Comments section
  function addNewToRecent(currentPost, commentContent, commentEmail) {
    const $commentList = $('.recent-comment-list');
    const $postTitle = currentPost.find('.post__title').text();
    console.log($postTitle);
    const html = `
      <li class="recent-comment">
        <h4 class="post__title recent-comment__title">${$postTitle}</h4>
        <p class="comment__content">
          ${commentContent}
          <span class="comment__author">By ${commentEmail}</span>
        </p>
      </li>
    `;

    $commentList.prepend(html);

    // Add click event to postTitle of the comment
    $('.recent-comment__title:first').on('click', function () {
      scrollToPost($(this));
    });
  }

  // Create a new comment thru the comment form
  function createComment(e) {
    console.log('create a comment', e);
    e.preventDefault();
    const $currentPost = $(e.delegateTarget);
    const $commentList = $currentPost.find('.comment-list');
    const $commentForm = $currentPost.find('.create-comment');
    const $commentContent = $currentPost.find('.comment-input').val();
    const commentEmail = currentUser.email.toLowerCase();
    $commentList.append(
      `<li class="comment">
        <i class="fas fa-share"></i>
        <p class="comment__content">
          ${$commentContent}
          <span class="comment__author">By ${commentEmail}</span>
        </p>
      </li>`
    );
    // Clear form
    $commentForm.trigger('reset');
    // Update comments number
    countComments($currentPost);
    // Update Recent Comments section
    addNewToRecent($currentPost, $commentContent, commentEmail);
  }

  // When page loads, add a random comment to the Recent Comments section
  function addRandomRecent() {
    console.log('add recent');
    const recentCommentHtml = recentCommentTemp(localData);
    $('.sidebar--right').append(recentCommentHtml);
    // Add click event to postTitle of the comment
    $('.recent-comment__title').on('click', function () {
      const $title = $(this);
      closePosts();
      setTimeout(() => {
        console.log('timeout');
        scrollToPost($title);
      }, 500);
    });
    // $('.comment__timeago').timeago();
  }

  // Click a postTitle in the Recent Comments section,
  // scroll to that post and fully expand it
  function scrollToPost(postTitle) {
    console.log('scroll to post', postTitle);
    // closePosts();
    const $currentPostTitle = postTitle.text();
    const $targetPost = $('.post').filter(function () {
      return $(this).find('.post__title').text() === $currentPostTitle;
    });
    const $targetCommentBlock = $targetPost.find('.post__comments');
    const $targetOffsetY = $targetPost.offset().top;
    console.log($targetOffsetY);

    $('html').animate({
      scrollTop: $targetOffsetY,
    }, {
      duration: 1000,
      easing: 'easeOutElastic',
      complete: function () {
        if (!$targetPost.hasClass('js-expanded--post')) {
          openPost($targetPost);
          openComments($targetCommentBlock);
        }
      }
    });
  }

  // When page loads, populate the feed section with posts
  function populatePosts() {
    console.log('populate posts');
    const postHtml = postTemp(localData);
    $('.feed').html(postHtml);
  }

  // Create a new post thru the create-post form
  function createPost(e) {
    e.preventDefault();
    console.log('create post');
    const $feed = $('.feed');
    const $postTitle = $.trim($('#title').val());
    const $postContent = $.trim($('#content').val());
    const createPostTemplate = Handlebars.compile($('#create-post-template').html());

    if ($postTitle !== '' && $postContent !== '') {
      // console.log($postTitle, $postContent);
      localData.newPost = {
        userId: currentUser.id,
        id: ++localData.posts.length,
        title: $postTitle,
        body: $postContent,
      };
      const html = createPostTemplate(localData);
      $feed.prepend(html);

      addListenersToPost($('.post:first'));
    }
    // Clear form
    $('.create-post').trigger('reset');
  }

  function shuffleArray(arr) {
    const n = arr.length;
    const results = arr.slice();
    for (let i = 0; i < n; i++) {
      const j = Math.floor(Math.random() * n);
      const temp = results[i];
      results[i] = results[j];
      results[j] = temp;
    }
    return results;
  }

  function addListenersToPost(posts) {
    console.log('add listeners', posts);
    // Count current comment number
    posts.each(function () {
      countComments($(this));
    });

    // Add event: Click on post title to open post
    posts.on('click', '.post__title', function () {
      openPost($(this).parent('.post'));
    });
    // Add event: Click on close icon to close post
    $('.post__close').on('click', closePosts);
    // Add event: toggle comments
    $('.comment-icon').on('click', function (e) {
      e.stopImmediatePropagation();
      toggleComments(this);
    });

    posts.on('click', '.submit-comment', createComment);
    $('.create-post').on('click', '.submit-post', createPost);
  }

  // Get data - posts
  $.get(`${url}posts`, data => {
    localData.posts = shuffleArray(data);
  })
    .fail(() => {
      console.error('Fail to get posts');
    });
  // Get data - users
  $.get(`${url}users`, data => {
    localData.users = data;
    currentUser.id = ++localData.users.length;
    localData.users.push(currentUser);
  })
    .fail(() => {
      console.error('Fail to get posts');
    });
  // Get data - comments
  $.get(`${url}comments`, data => {
    localData.comments = data;
  })
    .fail(() => {
      console.error('Fail to get posts');
    });


  // When data is loaded
  $(document).ajaxStop(() => {
    console.log('done');
    // Init forum
    populatePosts();
    addRandomRecent();
    // Add listeners
    addListenersToPost($('.post'));
  });
})(jQuery, Handlebars);